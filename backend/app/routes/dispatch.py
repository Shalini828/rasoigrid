from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.dispatch import Dispatch
from app.models.rescue_request import RescueRequest
from app.models.volunteer import VolunteerProfile
from app.models.ngo import NGOProfile
from app.schemas.dispatch import DispatchCreate, DispatchResponse
from app.dependencies.auth import get_current_user
from app.models.user import User


router = APIRouter(
    prefix="/api/dispatches",
    tags=["Dispatches"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=DispatchResponse)
def create_dispatch(
    dispatch: DispatchCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # 1. Check that the rescue request exists
    rescue_request = (
        db.query(RescueRequest)
        .filter(RescueRequest.id == dispatch.rescue_request_id)
        .first()
    )

    if not rescue_request:
        raise HTTPException(
            status_code=404,
            detail="Rescue request not found"
        )

    # 2. Only accepted rescue requests can be dispatched
    if rescue_request.status != "ACCEPTED":
        raise HTTPException(
            status_code=400,
            detail="Rescue request must be ACCEPTED before dispatch"
        )

    # 3. Check that the current user owns the NGO
    ngo = (
        db.query(NGOProfile)
        .filter(
            NGOProfile.id == rescue_request.ngo_id,
            NGOProfile.user_id == current_user.id
        )
        .first()
    )

    if not ngo:
        raise HTTPException(
            status_code=403,
            detail="Only the NGO that owns this rescue request can create a dispatch"
        )

    # 4. Prevent duplicate dispatches
    existing_dispatch = (
        db.query(Dispatch)
        .filter(
            Dispatch.rescue_request_id == dispatch.rescue_request_id
        )
        .first()
    )

    if existing_dispatch:
        raise HTTPException(
            status_code=400,
            detail="Dispatch already exists for this rescue request"
        )

    # 5. If a volunteer is assigned, check that they exist and are available
    volunteer = None

    if dispatch.volunteer_id is not None:
        volunteer = (
            db.query(VolunteerProfile)
            .filter(
                VolunteerProfile.id == dispatch.volunteer_id
            )
            .first()
        )

        if not volunteer:
            raise HTTPException(
                status_code=404,
                detail="Volunteer not found"
            )

        if volunteer.availability_status != "AVAILABLE":
            raise HTTPException(
                status_code=400,
                detail="Volunteer is not available"
            )

    # 6. Create dispatch
    new_dispatch = Dispatch(
        rescue_request_id=dispatch.rescue_request_id,
        volunteer_id=dispatch.volunteer_id,
        pickup_latitude=dispatch.pickup_latitude,
        pickup_longitude=dispatch.pickup_longitude,
        delivery_latitude=dispatch.delivery_latitude,
        delivery_longitude=dispatch.delivery_longitude,
        status="ASSIGNED" if dispatch.volunteer_id else "PENDING"
    )

    db.add(new_dispatch)

    # 7. Mark assigned volunteer as unavailable
    if volunteer:
        volunteer.availability_status = "UNAVAILABLE"

    db.commit()
    db.refresh(new_dispatch)

    return new_dispatch


@router.get("/my", response_model=list[DispatchResponse])
def get_my_dispatches(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Get NGO owned by current user
    ngo = (
        db.query(NGOProfile)
        .filter(NGOProfile.user_id == current_user.id)
        .first()
    )

    if not ngo:
        raise HTTPException(
            status_code=404,
            detail="NGO profile not found"
        )

    dispatches = (
        db.query(Dispatch)
        .join(
            RescueRequest,
            Dispatch.rescue_request_id == RescueRequest.id
        )
        .filter(
            RescueRequest.ngo_id == ngo.id
        )
        .order_by(Dispatch.id.desc())
        .all()
    )

    return dispatches


@router.patch("/{dispatch_id}/status", response_model=DispatchResponse)
def update_dispatch_status(
    dispatch_id: int,
    status: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    dispatch = (
        db.query(Dispatch)
        .filter(Dispatch.id == dispatch_id)
        .first()
    )

    if not dispatch:
        raise HTTPException(
            status_code=404,
            detail="Dispatch not found"
        )

    # Check that the current user owns the related NGO
    rescue_request = (
        db.query(RescueRequest)
        .filter(
            RescueRequest.id == dispatch.rescue_request_id
        )
        .first()
    )

    if not rescue_request:
        raise HTTPException(
            status_code=404,
            detail="Rescue request not found"
        )

    ngo = (
        db.query(NGOProfile)
        .filter(
            NGOProfile.id == rescue_request.ngo_id,
            NGOProfile.user_id == current_user.id
        )
        .first()
    )

    if not ngo:
        raise HTTPException(
            status_code=403,
            detail="You are not authorized to update this dispatch"
        )

    allowed_statuses = [
        "PENDING",
        "ASSIGNED",
        "PICKED_UP",
        "DELIVERED",
        "CANCELLED"
    ]

    if status not in allowed_statuses:
        raise HTTPException(
            status_code=400,
            detail="Invalid dispatch status"
        )

    dispatch.status = status

    # Make volunteer available again when dispatch is completed/cancelled
    if (
        dispatch.volunteer_id is not None
        and status in ["DELIVERED", "CANCELLED"]
    ):
        volunteer = (
            db.query(VolunteerProfile)
            .filter(
                VolunteerProfile.id == dispatch.volunteer_id
            )
            .first()
        )

        if volunteer:
            volunteer.availability_status = "AVAILABLE"

    db.commit()
    db.refresh(dispatch)

    return dispatch