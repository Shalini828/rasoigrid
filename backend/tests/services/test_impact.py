from app.services.impact import calculate_impact


def test_impact_calculation():
    result = calculate_impact(
        rescued_food_kg=100,
        organic_recovery_kg=50,
        successful_rescues=9,
        total_donations=10
    )

    assert result["rescued_food_kg"] == 100
    assert result["estimated_meals_supported"] == 200
    assert result["organic_recovery_kg"] == 50
    assert result["total_recovered_kg"] == 150
    assert result["successful_rescues"] == 9
    assert result["rescue_rate_percent"] == 90.0


def test_impact_with_no_donations():
    result = calculate_impact(
        rescued_food_kg=0,
        organic_recovery_kg=0,
        successful_rescues=0,
        total_donations=0
    )

    assert result["estimated_meals_supported"] == 0
    assert result["rescue_rate_percent"] == 0