from collections.abc import Iterable

from sqlalchemy.orm import Session

from app.models.ngo import NGOProfile
from app.models.notification import Notification


def notify(
    db: Session,
    user_ids: int | Iterable[int | None],
    message: str,
    link: str | None = None,
) -> None:
    """
    Store an in-app notification for one or more users and commit.

    Missing ids (None) and duplicates are skipped, so callers can pass
    whatever ids they have without checking each one.
    """
    if isinstance(user_ids, int):
        user_ids = [user_ids]

    unique_ids = {uid for uid in user_ids if uid is not None}
    if not unique_ids:
        return

    for user_id in sorted(unique_ids):
        db.add(Notification(user_id=user_id, message=message, link=link))

    db.commit()


def verified_ngo_user_ids(db: Session) -> list[int]:
    """User ids of every NGO allowed to claim food."""
    rows = (
        db.query(NGOProfile.user_id)
        .filter(NGOProfile.verification_status == "VERIFIED")
        .all()
    )
    return [row[0] for row in rows]
