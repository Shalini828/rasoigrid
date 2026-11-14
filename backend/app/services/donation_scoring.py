from app.services.decision import build_rescue_decision
from app.services.matching import calculate_distance


def score_donation(donation, ngo=None) -> dict:
    """
    Run the RasoiGrid decision engine for one donation.

    When an NGO is given, its distance and capacity are included,
    so nearby donations rank higher for that NGO.

    This is a planning score. It does NOT certify food safety.
    """

    distance_km = None
    ngo_capacity = None

    if ngo is not None:
        ngo_capacity = ngo.capacity

        if (
            donation.latitude is not None
            and donation.longitude is not None
            and ngo.latitude is not None
            and ngo.longitude is not None
        ):
            distance_km = calculate_distance(
                donation.latitude,
                donation.longitude,
                ngo.latitude,
                ngo.longitude
            )

    expired = donation.status == "EXPIRED"

    decision = build_rescue_decision(
        food_category=donation.food_category,
        quantity=donation.quantity,
        prepared_at=donation.prepared_at,
        consume_before=donation.consume_before,
        # Past its consume-before time, food can no longer go to people.
        rescue_possible=not expired,
        distance_to_ngo_km=distance_km,
        ngo_capacity=ngo_capacity
    )

    return {
        # An expired donation is no longer a pickup to prioritise.
        "priority": "LOW" if expired else decision["priority"]["priority"],
        "priority_score": 0 if expired else decision["priority"]["priority_score"],
        "urgency": decision["surplus"]["urgency"],
        "hours_remaining": decision["surplus"]["hours_remaining"],
        "recovery_path": decision["recovery"]["path"],
        "recommended_action": decision["final_action"],
        "distance_to_ngo_km": (
            round(distance_km, 2) if distance_km is not None else None
        ),
    }
