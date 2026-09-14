from app.services.recovery import recommend_recovery_path


def test_people_first_path():
    result = recommend_recovery_path(
        food_category="Cooked Meals",
        quantity_kg=50,
        rescue_possible=True
    )

    assert result["path"] == "PEOPLE_FIRST"
    assert result["landfill"] is False


def test_circular_recovery_path():
    result = recommend_recovery_path(
        food_category="Food Scraps",
        quantity_kg=30,
        rescue_possible=False
    )

    assert result["path"] == "CIRCULAR_RECOVERY"
    assert result["landfill"] is False


def test_landfill_last_path():
    result = recommend_recovery_path(
        food_category="Plastic Packaging",
        quantity_kg=10,
        rescue_possible=False
    )

    assert result["path"] == "LANDFILL_LAST"
    assert result["landfill"] is True