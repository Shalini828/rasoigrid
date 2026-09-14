from datetime import datetime, timezone


def calculate_surplus_score(
    quantity: float,
    prepared_at: datetime,
    consume_before: datetime
):
    """
    Calculate a planning score for how urgently a food donation
    may need rescue coordination.

    This is NOT a food-safety assessment.
    """

    now = datetime.now(timezone.utc)

    # Make naive datetimes timezone-aware
    if prepared_at.tzinfo is None:
        prepared_at = prepared_at.replace(tzinfo=timezone.utc)

    if consume_before.tzinfo is None:
        consume_before = consume_before.replace(tzinfo=timezone.utc)

    # Calculate remaining time
    hours_remaining = (
        consume_before - now
    ).total_seconds() / 3600

    score = 0

    # Quantity factor
    if quantity >= 50:
        score += 40
    elif quantity >= 20:
        score += 25
    else:
        score += 10

    # Time remaining factor
    if hours_remaining <= 2:
        score += 40
    elif hours_remaining <= 6:
        score += 30
    elif hours_remaining <= 12:
        score += 20
    else:
        score += 10

    # Convert score to risk level
    if score >= 70:
        risk = "HIGH"
    elif score >= 40:
        risk = "MEDIUM"
    else:
        risk = "LOW"

    # Convert risk to urgency
    if hours_remaining <= 2:
        urgency = "HIGH"
    elif hours_remaining <= 6:
        urgency = "MEDIUM"
    else:
        urgency = "LOW"

    return {
        "score": min(score, 100),
        "surplus_risk": risk,
        "urgency": urgency,
        "hours_remaining": round(hours_remaining, 2)
    }