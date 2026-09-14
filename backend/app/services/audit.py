from datetime import datetime, timezone


def create_audit_event(
    donation_id: int,
    action: str,
    actor_type: str,
    actor_id: int | None = None,
    details: str | None = None
):
    """
    Create a structured audit event for a donation.

    This records workflow history and does not make
    any food-safety certification claim.
    """

    allowed_actions = [
        "DONATED",
        "MATCHED",
        "REQUESTED",
        "ACCEPTED",
        "DISPATCHED",
        "PICKED_UP",
        "DELIVERED",
        "CANCELLED",
        "RECOVERY"
    ]

    if action not in allowed_actions:
        raise ValueError(
            f"Invalid audit action: {action}"
        )

    return {
        "donation_id": donation_id,
        "action": action,
        "actor_type": actor_type,
        "actor_id": actor_id,
        "details": details,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }