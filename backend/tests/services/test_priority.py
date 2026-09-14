from app.services.priority import calculate_priority


def test_critical_priority():
    result = calculate_priority(
        surplus_score=80,
        urgency="HIGH",
        distance_to_ngo_km=1.5,
        ngo_capacity=100
    )

    assert result["priority"] == "CRITICAL"
    assert result["priority_score"] == 100


def test_medium_priority():
    result = calculate_priority(
        surplus_score=40,
        urgency="LOW",
        distance_to_ngo_km=10,
        ngo_capacity=0
    )

    assert result["priority"] == "MEDIUM"
    assert result["priority_score"] == 40