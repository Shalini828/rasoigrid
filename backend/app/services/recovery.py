def recommend_recovery_path(
    food_category: str,
    quantity_kg: float,
    rescue_possible: bool
):
    """
    Recommend the next recovery pathway for surplus food.

    Priority:
    1. Human consumption when appropriately cleared by authorized
       food-safety personnel.
    2. Circular organic recovery.
    3. Landfill only as a last resort.

    This function does NOT determine food safety.
    """

    if rescue_possible:
        return {
            "path": "PEOPLE_FIRST",
            "recommended_action": (
                "Coordinate with a verified rescue organization "
                "after required human food-safety checks."
            ),
            "landfill": False
        }

    organic_categories = [
        "FRUITS",
        "VEGETABLES",
        "COOKED MEALS",
        "BAKERY",
        "GRAINS",
        "FOOD SCRAPS",
        "ORGANIC WASTE"
    ]

    category = food_category.strip().upper()

    if category in organic_categories:
        return {
            "path": "CIRCULAR_RECOVERY",
            "recommended_action": (
                "Route the organic material toward an appropriate "
                "composting, biogas, or other authorized recovery pathway."
            ),
            "landfill": False
        }

    return {
        "path": "LANDFILL_LAST",
        "recommended_action": (
            "Explore authorized recovery options first; use landfill "
            "only when no appropriate recovery pathway is available."
        ),
        "landfill": True
    }