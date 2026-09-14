from datetime import datetime

from app.services.surplus import calculate_surplus_score
from app.services.recovery import recommend_recovery_path
from app.services.priority import calculate_priority


def build_rescue_decision(
    food_category: str,
    quantity: float,
    prepared_at: datetime,
    consume_before: datetime,
    rescue_possible: bool,
    distance_to_ngo_km: float | None = None,
    ngo_capacity: float | None = None
):
    """
    Combine RasoiGrid intelligence modules into one decision.

    This is a planning and prioritization engine.
    It does NOT certify food safety.
    """

    # 1. Calculate surplus risk and urgency
    surplus = calculate_surplus_score(
        quantity=quantity,
        prepared_at=prepared_at,
        consume_before=consume_before
    )

    # 2. Determine recovery pathway
    recovery = recommend_recovery_path(
        food_category=food_category,
        quantity_kg=quantity,
        rescue_possible=rescue_possible
    )

    # 3. Calculate overall priority
    priority = calculate_priority(
        surplus_score=surplus["score"],
        urgency=surplus["urgency"],
        distance_to_ngo_km=distance_to_ngo_km,
        ngo_capacity=ngo_capacity
    )

    # 4. Build final recommendation
    if recovery["path"] == "PEOPLE_FIRST":
        action = (
            "Prioritize verified food rescue coordination "
            "after required human food-safety checks."
        )

    elif recovery["path"] == "CIRCULAR_RECOVERY":
        action = (
            "Route the material toward an appropriate "
            "authorized circular recovery pathway."
        )

    else:
        action = (
            "Explore recovery options first and use landfill "
            "only as a last resort."
        )

    return {
        "surplus": surplus,
        "priority": priority,
        "recovery": recovery,
        "final_action": action
    }