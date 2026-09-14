from datetime import datetime, timezone, timedelta

from app.services.decision import build_rescue_decision


def test_people_first_decision():
    result = build_rescue_decision(
        food_category="Cooked Meals",
        quantity=50,
        prepared_at=datetime.now(timezone.utc),
        consume_before=datetime.now(timezone.utc) + timedelta(hours=2),
        rescue_possible=True
    )

    assert result["surplus"]["surplus_risk"] == "HIGH"
    assert result["surplus"]["urgency"] == "HIGH"
    assert result["recovery"]["path"] == "PEOPLE_FIRST"

    assert "priority" in result
    assert "priority_score" in result["priority"]
    assert "priority" in result["priority"]


def test_circular_recovery_decision():
    result = build_rescue_decision(
        food_category="Food Scraps",
        quantity=30,
        prepared_at=datetime.now(timezone.utc),
        consume_before=datetime.now(timezone.utc) + timedelta(hours=24),
        rescue_possible=False
    )

    assert result["recovery"]["path"] == "CIRCULAR_RECOVERY"