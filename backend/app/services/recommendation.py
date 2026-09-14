from datetime import datetime

from app.services.decision import build_rescue_decision


def generate_recommendation(
    food_category: str,
    quantity: float,
    prepared_at: datetime,
    consume_before: datetime,
    rescue_possible: bool,
    distance_to_ngo_km: float | None = None,
    ngo_capacity: float | None = None
):
    """
    Generate one clean recommendation for the RasoiGrid frontend.

    This combines the existing intelligence engines.
    It does NOT make a food-safety determination.
    """

    decision = build_rescue_decision(
        food_category=food_category,
        quantity=quantity,
        prepared_at=prepared_at,
        consume_before=consume_before,
        rescue_possible=rescue_possible,
        distance_to_ngo_km=distance_to_ngo_km,
        ngo_capacity=ngo_capacity
    )

    return {
        "food_category": food_category,
        "quantity": quantity,
        "unit": "kg",
        "priority": decision["priority"]["priority"],
        "priority_score": decision["priority"]["priority_score"],
        "surplus_risk": decision["surplus"]["surplus_risk"],
        "urgency": decision["surplus"]["urgency"],
        "hours_remaining": decision["surplus"]["hours_remaining"],
        "recovery_path": decision["recovery"]["path"],
        "recommendation": decision["final_action"],
    }