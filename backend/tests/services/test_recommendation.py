from datetime import datetime, timezone, timedelta

from app.services.recommendation import generate_recommendation


def test_high_priority_recommendation():
    result = generate_recommendation(
        food_category="Cooked Meals",
        quantity=50,
        prepared_at=datetime.now(timezone.utc),
        consume_before=datetime.now(timezone.utc) + timedelta(hours=2),
        rescue_possible=True,
        distance_to_ngo_km=1.5,
        ngo_capacity=100
    )

    assert result["priority"] == "CRITICAL"
    assert result["priority_score"] == 100
    assert result["surplus_risk"] == "HIGH"
    assert result["urgency"] == "HIGH"
    assert result["recovery_path"] == "PEOPLE_FIRST"