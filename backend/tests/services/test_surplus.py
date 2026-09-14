from datetime import datetime, timezone, timedelta

from app.services.surplus import calculate_surplus_score


def test_high_surplus_risk():
    result = calculate_surplus_score(
        quantity=50,
        prepared_at=datetime.now(timezone.utc),
        consume_before=datetime.now(timezone.utc) + timedelta(hours=2)
    )

    assert result["surplus_risk"] == "HIGH"
    assert result["urgency"] == "HIGH"
    assert result["score"] >= 70


def test_low_surplus_risk():
    result = calculate_surplus_score(
        quantity=5,
        prepared_at=datetime.now(timezone.utc),
        consume_before=datetime.now(timezone.utc) + timedelta(hours=24)
    )

    assert result["surplus_risk"] == "LOW"
    assert result["urgency"] == "LOW"