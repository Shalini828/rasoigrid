"""
API tests for Phase 3: admin endpoints, handover-code lockout,
per-user impact, and the donor food-safety checklist.
"""

from datetime import datetime, timedelta, timezone

from tests.test_rescue_flow import (
    client,
    _create_admin,
    _register_and_login,
)


CHECKLIST = {
    "hygienic_preparation": True,
    "safe_temperature": True,
    "covered_and_labelled": True,
    "no_spoilage_signs": True,
    "allergens": "Contains nuts",
}


def _donation_body(**extra):
    now = datetime.now(timezone.utc)
    body = {
        "food_name": "Phase 3 thali",
        "food_category": "COOKED MEALS",
        "quantity": 12,
        "unit": "kg",
        "prepared_at": (now - timedelta(hours=1)).isoformat(),
        "consume_before": (now + timedelta(hours=5)).isoformat(),
        "latitude": 19.07,
        "longitude": 72.86,
    }
    body.update(extra)
    return body


def _delivery_setup():
    """Donor lists food, verified NGO claims it, a volunteer is assigned."""
    donor = _register_and_login("DONOR")
    ngo = _register_and_login("NGO")
    volunteer = _register_and_login("VOLUNTEER")
    admin = _create_admin()

    ngo_id = client.post("/api/ngos/", headers=ngo, json={
        "organization_name": "Phase 3 Shelter",
        "address": "3 Test Road, Mumbai",
        "latitude": 19.06,
        "longitude": 72.85,
        "capacity": 100,
    }).json()["id"]
    client.patch(f"/api/ngos/{ngo_id}/verify", headers=admin)

    volunteer_id = client.post("/api/volunteers/", headers=volunteer, json={
        "vehicle_type": "scooter",
        "latitude": 19.07,
        "longitude": 72.86,
    }).json()["id"]

    donation_id = client.post(
        "/api/donations/", headers=donor,
        json=_donation_body(safety_checklist=CHECKLIST),
    ).json()["id"]

    request_id = client.post("/api/rescue-requests/", headers=ngo, json={
        "donation_id": donation_id,
        "ngo_id": ngo_id,
    }).json()["id"]
    client.patch(
        f"/api/rescue-requests/{request_id}/status",
        headers=ngo, params={"status": "ACCEPTED"},
    )

    dispatch = client.post("/api/dispatches/", headers=ngo, json={
        "rescue_request_id": request_id,
        "volunteer_id": volunteer_id,
    }).json()

    return {
        "donor": donor, "ngo": ngo, "volunteer": volunteer, "admin": admin,
        "donation_id": donation_id, "dispatch": dispatch,
    }


# --- Food-safety checklist ---------------------------------------------

def test_safety_checklist_is_saved_and_returned():
    donor = _register_and_login("DONOR")

    response = client.post(
        "/api/donations/", headers=donor,
        json=_donation_body(safety_checklist=CHECKLIST),
    )
    assert response.status_code == 200, response.text
    checklist = response.json()["safety_checklist"]
    assert checklist["no_spoilage_signs"] is True
    assert checklist["allergens"] == "Contains nuts"


def test_unconfirmed_safety_item_is_rejected():
    donor = _register_and_login("DONOR")

    response = client.post(
        "/api/donations/", headers=donor,
        json=_donation_body(
            safety_checklist={**CHECKLIST, "safe_temperature": False}
        ),
    )
    assert response.status_code == 422
    assert "safe_temperature" in response.text


# --- Handover code -----------------------------------------------------

def test_ngo_sees_code_in_its_list_and_can_confirm_without_it():
    setup = _delivery_setup()
    dispatch_id = setup["dispatch"]["id"]

    listed = client.get("/api/dispatches/my", headers=setup["ngo"]).json()
    mine = next(d for d in listed if d["id"] == dispatch_id)
    assert mine["handover_code"] == setup["dispatch"]["handover_code"]

    # The NGO is the receiver, so it can confirm directly
    confirmed = client.patch(
        f"/api/dispatches/{dispatch_id}/status",
        headers=setup["ngo"], params={"status": "DELIVERED"},
    )
    assert confirmed.status_code == 200, confirmed.text
    assert confirmed.json()["handover_confirmed"] is True


def test_handover_code_locks_after_five_wrong_tries():
    setup = _delivery_setup()
    dispatch_id = setup["dispatch"]["id"]
    real = setup["dispatch"]["handover_code"]
    wrong = "000000" if real != "000000" else "111111"

    for _ in range(5):
        r = client.patch(
            f"/api/dispatches/{dispatch_id}/status",
            headers=setup["volunteer"],
            params={"status": "DELIVERED", "code": wrong},
        )
        assert r.status_code == 400

    locked = client.patch(
        f"/api/dispatches/{dispatch_id}/status",
        headers=setup["volunteer"],
        params={"status": "DELIVERED", "code": real},
    )
    assert locked.status_code == 423


# --- Per-user impact ---------------------------------------------------

def test_impact_me_is_scoped_to_the_user():
    setup = _delivery_setup()
    dispatch_id = setup["dispatch"]["id"]
    client.patch(
        f"/api/dispatches/{dispatch_id}/status",
        headers=setup["volunteer"],
        params={"status": "DELIVERED", "code": setup["dispatch"]["handover_code"]},
    )

    for role in ("donor", "ngo", "volunteer"):
        impact = client.get("/api/impact/me", headers=setup[role]).json()
        assert impact["rescued_food_kg"] == 12, role
        assert impact["successful_rescues"] == 1, role
        assert impact["total_donations"] == 1, role

    # A brand-new donor has no impact yet
    newcomer = _register_and_login("DONOR")
    empty = client.get("/api/impact/me", headers=newcomer).json()
    assert empty["rescued_food_kg"] == 0
    assert empty["total_donations"] == 0


# --- Admin endpoints ---------------------------------------------------

def test_admin_endpoints_need_an_admin():
    donor = _register_and_login("DONOR")
    for path in ("/api/admin/users", "/api/admin/audit", "/api/admin/overview"):
        assert client.get(path, headers=donor).status_code == 403


def test_admin_sees_users_audit_and_overview():
    setup = _delivery_setup()
    admin = setup["admin"]

    users = client.get("/api/admin/users", headers=admin)
    assert users.status_code == 200
    ngo_rows = [
        u for u in users.json()
        if u["role"] == "NGO" and u["organization_name"] == "Phase 3 Shelter"
    ]
    assert ngo_rows and ngo_rows[0]["profile_status"] == "VERIFIED"

    audit = client.get("/api/admin/audit", headers=admin)
    assert audit.status_code == 200
    actions = {
        e["action"] for e in audit.json()
        if e["donation_id"] == setup["donation_id"]
    }
    assert {"DONATED", "REQUESTED", "DISPATCHED"} <= actions
    event = next(e for e in audit.json() if e["donation_id"] == setup["donation_id"])
    assert event["food_name"] == "Phase 3 thali"

    overview = client.get("/api/admin/overview", headers=admin)
    assert overview.status_code == 200
    data = overview.json()
    assert data["users"]["total"] >= 4
    assert data["ngos"]["verified"] >= 1
    assert data["dispatches"]["assigned"] >= 1
