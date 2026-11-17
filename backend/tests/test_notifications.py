"""
API tests for in-app notifications (Phase 4).
"""

from tests.test_phase3 import _delivery_setup
from tests.test_rescue_flow import client, _register_and_login


def _messages(headers):
    response = client.get("/api/notifications/me", headers=headers)
    assert response.status_code == 200, response.text
    return response.json()


def test_rescue_flow_notifies_each_role():
    s = _delivery_setup()

    # The NGO was verified before the food was listed, so it heard about it
    ngo_texts = [n["message"] for n in _messages(s["ngo"])["items"]]
    assert any(t.startswith("New food listed: Phase 3 thali") for t in ngo_texts)

    # The donor heard that the NGO claimed it
    donor = _messages(s["donor"])
    assert any("Phase 3 Shelter claimed your Phase 3 thali" == n["message"]
               for n in donor["items"])

    # The volunteer heard about the pickup
    volunteer_texts = [n["message"] for n in _messages(s["volunteer"])["items"]]
    assert "New pickup assigned: Phase 3 thali" in volunteer_texts

    # Pickup and delivery reach the donor
    dispatch_id = s["dispatch"]["id"]
    client.patch(f"/api/dispatches/{dispatch_id}/status",
                 headers=s["volunteer"], params={"status": "PICKED_UP"})
    client.patch(f"/api/dispatches/{dispatch_id}/status",
                 headers=s["volunteer"],
                 params={"status": "DELIVERED",
                         "code": s["dispatch"]["handover_code"]})

    donor_texts = [n["message"] for n in _messages(s["donor"])["items"]]
    assert "A volunteer collected your Phase 3 thali" in donor_texts
    assert "Your Phase 3 thali reached the NGO. Thank you!" in donor_texts
    assert "Phase 3 thali was delivered" in [
        n["message"] for n in _messages(s["ngo"])["items"]
    ]


def test_mark_read_and_read_all():
    s = _delivery_setup()
    donor = s["donor"]

    before = _messages(donor)
    assert before["unread"] >= 1
    first_id = before["items"][0]["id"]

    marked = client.patch(f"/api/notifications/{first_id}/read", headers=donor)
    assert marked.status_code == 200
    assert marked.json()["is_read"] is True
    assert _messages(donor)["unread"] == before["unread"] - 1

    client.post("/api/notifications/read-all", headers=donor)
    assert _messages(donor)["unread"] == 0


def test_cannot_read_someone_elses_notification():
    s = _delivery_setup()
    their_id = _messages(s["donor"])["items"][0]["id"]

    stranger = _register_and_login("DONOR")
    response = client.patch(f"/api/notifications/{their_id}/read", headers=stranger)
    assert response.status_code == 404
    assert _messages(stranger)["items"] == []
