from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.models.donation import Donation
from app.services.audit import create_audit_event


def utc_now_naive() -> datetime:
    """Current UTC time without tzinfo, matching how donations are stored."""
    return datetime.now(timezone.utc).replace(tzinfo=None)


def expire_stale_donations(db: Session) -> int:
    """
    Mark AVAILABLE donations whose consume-before time has passed
    as EXPIRED, and record an audit event for each.

    Donations already claimed or in transit are left alone.
    Returns the number of donations expired.
    """

    stale = (
        db.query(Donation)
        .filter(
            Donation.status == "AVAILABLE",
            Donation.consume_before < utc_now_naive()
        )
        .all()
    )

    if not stale:
        return 0

    for donation in stale:
        donation.status = "EXPIRED"

    db.commit()

    for donation in stale:
        create_audit_event(
            donation_id=donation.id,
            action="EXPIRED",
            actor_type="SYSTEM",
            details="Consume-before time passed before an NGO claimed it",
            db=db
        )

    return len(stale)
