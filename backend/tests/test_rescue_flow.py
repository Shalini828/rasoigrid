"""
End-to-end test of the core rescue flow through the HTTP API:

donor lists food -> admin verifies NGO -> NGO requests and accepts
-> NGO dispatches a volunteer -> volunteer picks up and delivers.
"""

import sys
import types
import uuid
from datetime import datetime, timedelta, timezone


# Gemini is not used in this flow; stub it so no API key is needed.
fake_genai = types.ModuleType("google.genai")


class FakeClient:
    def __init__(self, *args, **kwargs):
        pass


fake_genai.Client = FakeClient
fake_google = types.ModuleType("google")
fake_google.genai = fake_genai
fake_google.__path__ = []
sys.modules.setdefault("google", fake_google)
sys.modules.setdefault("google.genai", fake_genai)


from fastapi.testclient import TestClient
from pwdlib import PasswordHash

from app.main import app
from app.database import SessionLocal
from app.models.user import User


client = TestClient(app)


def _unique():
    return uuid.uuid4().hex[:10]


def _register_and_login(role):
    suffix = _unique()
    email = f"{role.lower()}-{suffix}@rasoigrid.com"
    password = "flow-test-password"

    response = client.post("/api/auth/register", json={
        "name": f"Flow {role}",
        "email": email,
        "phone": f"9{int(suffix, 16) % 10**9:09d}",
        "password": password,
        "role": role,
    })
    assert response.status_code == 200, response.text

    return _login(email, password)


def _login(email, password):
    response = client.post("/api/auth/login", json={
        "email": email,
        "password": password,
    })
    assert response.status_code == 200, response.text
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def _create_admin():
    suffix = _unique()
    email = f"admin-{suffix}@rasoigrid.com"
    password = "flow-admin-password"

    db = SessionLocal()
    try:
        db.add(User(
            name="Flow Admin",
            email=email,
            phone=f"8{int(suffix, 16) % 10**9:09d}",
            password_hash=PasswordHash.recommended().hash(password),
            role="ADMIN",
        ))
        db.commit()
    finally:
        db.close()

    return _login(email, password)


def test_full_rescue_flow():
    donor = _register_and_login("DONOR")
    ngo = _register_and_login("NGO")
    volunteer = _register_and_login("VOLUNTEER")
    admin = _create_admin()

    # /me returns the logged-in account
    me = client.get("/api/auth/me", headers=donor)
    assert me.status_code == 200
    assert me.json()["role"] == "DONOR"

    # NGO and volunteer set up their profiles
    ngo_profile = client.post("/api/ngos/", headers=ngo, json={
        "organization_name": "Flow Shelter",
        "address": "12 Test Road, Mumbai",
        "latitude": 19.06,
        "longitude": 72.85,
        "capacity": 200,
    })
    assert ngo_profile.status_code == 200, ngo_profile.text
    ngo_id = ngo_profile.json()["id"]

    volunteer_profile = client.post("/api/volunteers/", headers=volunteer, json={
        "vehicle_type": "scooter",
        "latitude": 19.07,
        "longitude": 72.86,
    })
    assert volunteer_profile.status_code == 200, volunteer_profile.text
    volunteer_id = volunteer_profile.json()["id"]

    # Admin sees the pending NGO and verifies it
    all_ngos = client.get("/api/ngos/all", headers=admin)
    assert all_ngos.status_code == 200
    assert any(n["id"] == ngo_id for n in all_ngos.json())

    verified = client.patch(f"/api/ngos/{ngo_id}/verify", headers=admin)
    assert verified.json()["verification_status"] == "VERIFIED"

    # Donor lists food
    now = datetime.now(timezone.utc)
    donation = client.post("/api/donations/", headers=donor, json={
        "food_name": "Veg biryani",
        "food_category": "COOKED MEALS",
        "quantity": 25,
        "unit": "kg",
        "prepared_at": (now - timedelta(hours=1)).isoformat(),
        "consume_before": (now + timedelta(hours=4)).isoformat(),
        "storage_condition": "HOT",
        "latitude": 19.07,
        "longitude": 72.86,
    })
    assert donation.status_code == 200, donation.text
    donation_id = donation.json()["id"]

    # NGO requests and accepts it
    request = client.post("/api/rescue-requests/", headers=ngo, json={
        "donation_id": donation_id,
        "ngo_id": ngo_id,
    })
    assert request.status_code == 200, request.text
    request_id = request.json()["id"]
    assert request.json()["donation"]["food_name"] == "Veg biryani"

    accepted = client.patch(
        f"/api/rescue-requests/{request_id}/status",
        headers=ngo,
        params={"status": "ACCEPTED"},
    )
    assert accepted.json()["status"] == "ACCEPTED"
    assert accepted.json()["donation"]["status"] == "CLAIMED"

    # NGO finds an available volunteer and dispatches them
    available = client.get(
        "/api/volunteers/available",
        headers=ngo,
        params={"donation_id": donation_id},
    )
    assert available.status_code == 200
    assert any(v["id"] == volunteer_id for v in available.json())

    dispatch = client.post("/api/dispatches/", headers=ngo, json={
        "rescue_request_id": request_id,
        "volunteer_id": volunteer_id,
    })
    assert dispatch.status_code == 200, dispatch.text
    dispatch_id = dispatch.json()["id"]
    assert dispatch.json()["status"] == "ASSIGNED"

    # A volunteer who is not assigned to this pickup can't change it
    stranger = _register_and_login("VOLUNTEER")
    blocked = client.patch(
        f"/api/dispatches/{dispatch_id}/status",
        headers=stranger,
        params={"status": "PICKED_UP"},
    )
    assert blocked.status_code == 403
    assert blocked.json()["detail"] == "You are not assigned to this dispatch"

    # The NGO gets a six-digit handover code; the volunteer does not
    handover_code = dispatch.json()["handover_code"]
    assert handover_code and len(handover_code) == 6

    # Volunteer sees it and moves it through pickup and delivery
    assigned = client.get("/api/dispatches/assigned", headers=volunteer)
    assert assigned.status_code == 200
    mine = [d for d in assigned.json() if d["id"] == dispatch_id]
    assert mine and mine[0]["donation"]["id"] == donation_id
    assert mine[0]["requires_handover_code"] is True
    assert mine[0]["handover_code"] is None

    picked = client.patch(
        f"/api/dispatches/{dispatch_id}/status",
        headers=volunteer,
        params={"status": "PICKED_UP"},
    )
    assert picked.json()["donation"]["status"] == "IN_TRANSIT"

    # Delivering needs the NGO's code
    no_code = client.patch(
        f"/api/dispatches/{dispatch_id}/status",
        headers=volunteer,
        params={"status": "DELIVERED"},
    )
    assert no_code.status_code == 400

    wrong = "000000" if handover_code != "000000" else "111111"
    wrong_code = client.patch(
        f"/api/dispatches/{dispatch_id}/status",
        headers=volunteer,
        params={"status": "DELIVERED", "code": wrong},
    )
    assert wrong_code.status_code == 400

    delivered = client.patch(
        f"/api/dispatches/{dispatch_id}/status",
        headers=volunteer,
        params={"status": "DELIVERED", "code": handover_code},
    )
    assert delivered.status_code == 200, delivered.text
    assert delivered.json()["status"] == "DELIVERED"
    assert delivered.json()["handover_confirmed"] is True
    assert delivered.json()["handover_code"] is None
    assert delivered.json()["volunteer_name"] == "Flow VOLUNTEER"
    assert delivered.json()["ngo_name"] == "Flow Shelter"
    assert delivered.json()["donation"]["status"] == "DELIVERED"

    # Donor's history reflects the delivery
    history = client.get("/api/donations/my", headers=donor).json()
    assert history[0]["status"] == "DELIVERED"

    # Volunteer is free again
    profile = client.get("/api/volunteers/my", headers=volunteer).json()
    assert profile["availability_status"] == "AVAILABLE"
