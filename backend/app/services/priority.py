def calculate_priority(
    surplus_score: int,
    urgency: str,
    distance_to_ngo_km: float | None = None,
    ngo_capacity: float | None = None
):
    """
    Combine surplus risk, urgency, and rescue feasibility
    into a single RasoiGrid priority score.

    This is a planning tool, not a food-safety assessment.
    """

    score = surplus_score

    # Urgency
    if urgency == "HIGH":
        score += 20
    elif urgency == "MEDIUM":
        score += 10

    # Nearby rescue organization
    if distance_to_ngo_km is not None:
        if distance_to_ngo_km <= 2:
            score += 10
        elif distance_to_ngo_km <= 5:
            score += 5

    # Available NGO capacity
    if ngo_capacity is not None and ngo_capacity > 0:
        score += 10

    score = min(score, 100)

    if score >= 80:
        priority = "CRITICAL"
    elif score >= 60:
        priority = "HIGH"
    elif score >= 40:
        priority = "MEDIUM"
    else:
        priority = "LOW"

    return {
        "priority_score": score,
        "priority": priority
    }