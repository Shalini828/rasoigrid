import pytest

from app.services.audit import create_audit_event


def test_create_audit_event():
    result = create_audit_event(
        donation_id=1,
        action="DONATED",
        actor_type="DONOR",
        actor_id=10,
        details="Donation created"
    )

    assert result["donation_id"] == 1
    assert result["action"] == "DONATED"
    assert result["actor_type"] == "DONOR"
    assert result["actor_id"] == 10
    assert result["details"] == "Donation created"
    assert "timestamp" in result


def test_invalid_audit_action():
    with pytest.raises(ValueError):
        create_audit_event(
            donation_id=1,
            action="INVALID",
            actor_type="DONOR"
        )