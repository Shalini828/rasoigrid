"""
API tests for Phase 2: donation priority scoring, expiry,
and volunteer ranking.
"""

from datetime import datetime, timedelta, timezone

from tests.test_rescue_flow import (
    client,
    _create_admin,
    _register_and_login,
)


def _donation(headers, *, quantity, hours_left, lat=19.07, lng=72.86):
    now = datetime.now(timezone.utc)
    response = client.post("/api/donations/", headers=headers, json={
        "food_name": f"Test food {quantity}kg {hours_left}h",
        "food_category": "COOKED MEALS",
        "quantity": quantity,
        "unit": "kg",
        "prepared_at": (now - timedelta(hours=8)).isoformat(),
        "consume_before": (now + timedelta(hours=hours_left)).isoformat(),
        "latitude": lat,
        "longitude": lng,
    })
    assert response.status_code == 200, response.text
    return response.json()


def _verified_ngo():
    ngo = _register_and_login("NGO")
    admin = _create_admin()
    profile = client.post("/api/ngos/", headers=ngo, json={
        "organization_name": "Scoring Shelter",
        "address": "1 Test Road, Mumbai",
        "latitude": 19.06,
        "longitude": 72.85,
        "capacity": 200,
    })
    assert profile.status_code == 200, profile.text
    ngo_id = profile.json()["id"]
    client.patch(f"/api/ngos/{ngo_id}/verify", headers=admin)
    return ngo, ngo_id


def test_donations_carry_priority_and_urgent_comes_first():
    donor = _register_and_login("DONOR")
    ngo, _ = _verified_ngo()

    relaxed = _donation(donor, quantity=5, hours_left=20)
    urgent = _donation(donor, quantity=25, hours_left=1)

    # The donor sees planning scores on their own donations
    assert urgent["priority"] in ("HIGH", "CRITICAL")
    assert relaxed["priority"] in ("LOW", "MEDIUM")
    assert urgent["recovery_path"] == "PEOPLE_FIRST"

    available = client.get("/api/donations/", headers=ngo)
    assert available.status_code == 200
    rows = available.json()
    ids = [d["id"] for d in rows]

    assert ids.index(urgent["id"]) < ids.index(relaxed["id"])

    # The list is ordered by priority score, highest first
    scores = [d["priority_score"] for d in rows]
    assert scores == sorted(scores, reverse=True)

    # NGO-specific scoring includes the distance to the NGO
    mine = next(d for d in rows if d["id"] == urgent["id"])
    assert mine["distance_to_ngo_km"] is not None


def test_past_due_donation_expires_and_cannot_be_claimed():
    donor = _register_and_login("DONOR")
    ngo, ngo_id = _verified_ngo()

    stale = _donation(donor, quantity=10, hours_left=-1)

    available = client.get("/api/donations/", headers=ngo)
    assert stale["id"] not in [d["id"] for d in available.json()]

    mine = client.get("/api/donations/my", headers=donor).json()
    row = next(d for d in mine if d["id"] == stale["id"])
    assert row["status"] == "EXPIRED"
    assert row["priority_score"] == 0
    # Too late for people; suggest organic recovery instead
    assert row["recovery_path"] == "CIRCULAR_RECOVERY"

    claim = client.post("/api/rescue-requests/", headers=ngo, json={
        "donation_id": stale["id"],
        "ngo_id": ngo_id,
    })
    assert claim.status_code == 400
    assert claim.json()["detail"] == "Donation has expired"

    cancel = client.patch(
        f"/api/donations/{stale['id']}/cancel", headers=donor
    )
    assert cancel.status_code == 400


def test_available_volunteers_are_ranked_for_the_pickup():
    donor = _register_and_login("DONOR")
    ngo, _ = _verified_ngo()

    far = _register_and_login("VOLUNTEER")
    near = _register_and_login("VOLUNTEER")

    far_id = client.post("/api/volunteers/", headers=far, json={
        "vehicle_type": "bike",
        "latitude": 19.30,
        "longitude": 72.95,
    }).json()["id"]
    near_id = client.post("/api/volunteers/", headers=near, json={
        "vehicle_type": "scooter",
        "latitude": 19.071,
        "longitude": 72.861,
    }).json()["id"]

    donation = _donation(donor, quantity=10, hours_left=5)

    response = client.get(
        "/api/volunteers/available",
        headers=ngo,
        params={"donation_id": donation["id"]},
    )
    assert response.status_code == 200
    rows = response.json()
    ids = [v["id"] for v in rows]

    assert ids.index(near_id) < ids.index(far_id)

    near_row = next(v for v in rows if v["id"] == near_id)
    assert near_row["distance_km"] < 1
    assert near_row["match_score"] is not None
