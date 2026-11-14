from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies.auth import get_current_user
from app.models.audit import AuditEvent
from app.models.dispatch import Dispatch
from app.models.donation import Donation
from app.models.ngo import NGOProfile
from app.models.user import User
from app.models.volunteer import VolunteerProfile
from app.services.expiry import expire_stale_donations


router = APIRouter(
    prefix="/api/admin",
    tags=["Admin"]
)


def require_admin(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != "ADMIN":
        raise HTTPException(
            status_code=403,
            detail="Only admins can access this"
        )
    return current_user


# ------------------------------------------------------------------
# Users
# ------------------------------------------------------------------

class AdminUserResponse(BaseModel):
    id: int
    name: str
    email: str
    phone: str
    role: str
    created_at: datetime | None = None
    # NGO: PENDING / VERIFIED. Volunteer: AVAILABLE / UNAVAILABLE.
    # NO_PROFILE when an NGO or volunteer hasn't set up a profile yet.
    # None for donors and admins, who have no profile step.
    profile_status: str | None = None
    organization_name: str | None = None


@router.get("/users", response_model=list[AdminUserResponse])
def list_users(
    db: Session = Depends(get_db),
    _: User = Depends(require_admin)
):
    users = db.query(User).order_by(User.id.desc()).all()

    ngos = {n.user_id: n for n in db.query(NGOProfile).all()}
    volunteers = {v.user_id: v for v in db.query(VolunteerProfile).all()}

    rows = []

    for user in users:
        profile_status = None
        organization_name = None

        if user.role == "NGO":
            ngo = ngos.get(user.id)
            profile_status = ngo.verification_status if ngo else "NO_PROFILE"
            organization_name = ngo.organization_name if ngo else None
        elif user.role == "VOLUNTEER":
            volunteer = volunteers.get(user.id)
            profile_status = (
                volunteer.availability_status if volunteer else "NO_PROFILE"
            )

        rows.append(AdminUserResponse(
            id=user.id,
            name=user.name,
            email=user.email,
            phone=user.phone,
            role=user.role,
            created_at=user.created_at,
            profile_status=profile_status,
            organization_name=organization_name,
        ))

    return rows


# ------------------------------------------------------------------
# Audit trail
# ------------------------------------------------------------------

class AdminAuditResponse(BaseModel):
    id: int
    donation_id: int
    food_name: str | None = None
    action: str
    actor_type: str
    actor_id: int | None = None
    actor_name: str | None = None
    details: str | None = None
    timestamp: datetime


@router.get("/audit", response_model=list[AdminAuditResponse])
def list_audit_events(
    limit: int = 200,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin)
):
    limit = max(1, min(limit, 1000))

    events = (
        db.query(AuditEvent)
        .order_by(AuditEvent.timestamp.desc(), AuditEvent.id.desc())
        .limit(limit)
        .all()
    )

    donation_ids = {e.donation_id for e in events}
    actor_ids = {e.actor_id for e in events if e.actor_id is not None}

    food_names = dict(
        db.query(Donation.id, Donation.food_name)
        .filter(Donation.id.in_(donation_ids))
        .all()
    ) if donation_ids else {}

    actor_names = dict(
        db.query(User.id, User.name)
        .filter(User.id.in_(actor_ids))
        .all()
    ) if actor_ids else {}

    return [
        AdminAuditResponse(
            id=e.id,
            donation_id=e.donation_id,
            food_name=food_names.get(e.donation_id),
            action=e.action,
            actor_type=e.actor_type,
            actor_id=e.actor_id,
            actor_name=actor_names.get(e.actor_id),
            details=e.details,
            timestamp=e.timestamp,
        )
        for e in events
    ]


# ------------------------------------------------------------------
# Network overview (counts for the admin dashboard)
# ------------------------------------------------------------------

def _counts(db: Session, column) -> dict[str, int]:
    return {
        key: count
        for key, count in db.query(column, func.count()).group_by(column).all()
    }


@router.get("/overview")
def network_overview(
    db: Session = Depends(get_db),
    _: User = Depends(require_admin)
):
    expire_stale_donations(db)

    users = _counts(db, User.role)
    ngos = _counts(db, NGOProfile.verification_status)
    volunteers = _counts(db, VolunteerProfile.availability_status)
    donations = _counts(db, Donation.status)
    dispatches = _counts(db, Dispatch.status)

    finished = donations.get("DELIVERED", 0)
    lost = donations.get("EXPIRED", 0)

    return {
        "users": {
            "total": sum(users.values()),
            "donors": users.get("DONOR", 0),
            "ngos": users.get("NGO", 0),
            "volunteers": users.get("VOLUNTEER", 0),
            "admins": users.get("ADMIN", 0),
        },
        "ngos": {
            "verified": ngos.get("VERIFIED", 0),
            "pending": ngos.get("PENDING", 0),
        },
        "volunteers": {
            "on_duty": volunteers.get("AVAILABLE", 0),
            "busy_or_off": volunteers.get("UNAVAILABLE", 0),
        },
        "donations": {
            "total": sum(donations.values()),
            "available": donations.get("AVAILABLE", 0),
            "claimed": donations.get("CLAIMED", 0),
            "in_transit": donations.get("IN_TRANSIT", 0),
            "delivered": finished,
            "expired": lost,
            "cancelled": donations.get("CANCELLED", 0),
        },
        "dispatches": {
            "waiting_for_volunteer": dispatches.get("PENDING", 0),
            "assigned": dispatches.get("ASSIGNED", 0),
            "picked_up": dispatches.get("PICKED_UP", 0),
            "delivered": dispatches.get("DELIVERED", 0),
            "cancelled": dispatches.get("CANCELLED", 0),
        },
        # Of donations that reached an end state by being delivered or
        # expiring, the share that reached people.
        "delivery_rate_percent": (
            round(finished / (finished + lost) * 100, 1)
            if finished + lost
            else None
        ),
    }
