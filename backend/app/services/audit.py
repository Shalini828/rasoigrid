from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.models.audit import AuditEvent


def create_audit_event(
    donation_id: int,
    action: str,
    actor_type: str,
    actor_id: int | None = None,
    details: str | None = None,
    db: Session | None = None
):
    """
    Create an audit event for a donation.

    If a database session is provided, the event is
    persisted to the audit_events table.
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

    timestamp = datetime.now(timezone.utc)

    event_data = {
        "donation_id": donation_id,
        "action": action,
        "actor_type": actor_type,
        "actor_id": actor_id,
        "details": details,
        "timestamp": timestamp.isoformat()
    }

    if db is not None:
        event = AuditEvent(
            donation_id=donation_id,
            action=action,
            actor_type=actor_type,
            actor_id=actor_id,
            details=details,
            timestamp=timestamp
        )

        db.add(event)
        db.commit()
        db.refresh(event)

    return event_data