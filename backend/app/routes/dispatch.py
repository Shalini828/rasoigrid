from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.dispatch import Dispatch
from app.models.rescue_request import RescueRequest
from app.models.volunteer import VolunteerProfile
from app.models.ngo import NGOProfile
from app.models.user import User
from app.schemas.dispatch import DispatchCreate, DispatchResponse
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.models.donation import Donation
from app.models.impact import ImpactRecord
from app.services.audit import create_audit_event


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
    # Only NGO users can create dispatches
    if current_user.role != "NGO":
        raise HTTPException(
            status_code=403,
            detail="Only NGO users can create dispatches"
        )

    # 1. Check that the rescue request exists
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

    # 2. Only accepted rescue requests can be dispatched
    if rescue_request.status != "ACCEPTED":
        raise HTTPException(
            status_code=400,
            detail="Rescue request must be ACCEPTED before dispatch"
        )

    # 3. Check that the current user owns the NGO
        # NGO must own the related NGO profile
    if current_user.role == "NGO":
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
        status=(
            "ASSIGNED"
            if dispatch.volunteer_id
            else "PENDING"
        )
    )

    db.add(new_dispatch)

    # 7. Mark assigned volunteer as unavailable
    if volunteer:
        volunteer.availability_status = "UNAVAILABLE"

    db.flush()

    create_audit_event(
        donation_id=rescue_request.donation_id,
        action="DISPATCHED",
        actor_type="NGO",
        actor_id=current_user.id,
        details="Dispatch created",
        db=db
    )

    db.refresh(new_dispatch)

    return new_dispatch

@router.get("/my", response_model=list[DispatchResponse])
def get_my_dispatches(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Only NGO users can access NGO dispatches
    if current_user.role != "NGO":
        raise HTTPException(
            status_code=403,
            detail="Only NGO users can view NGO dispatches"
        )

    # Get NGO owned by current user
    ngo = (
        db.query(NGOProfile)
        .filter(
            NGOProfile.user_id == current_user.id
        )
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


@router.patch(
    "/{dispatch_id}/status",
    response_model=DispatchResponse
)
def update_dispatch_status(
    dispatch_id: int,
    status: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Only NGO users or the assigned volunteer can update dispatches
      
    if current_user.role not in ["NGO", "VOLUNTEER"]:
        raise HTTPException(
            status_code=403,
            detail="Only NGO users or assigned volunteers can update dispatches"
        )

    # Find dispatch
    dispatch = (
        db.query(Dispatch)
        .filter(
            Dispatch.id == dispatch_id
        )
        .first()
    )

    if not dispatch:
        raise HTTPException(
            status_code=404,
            detail="Dispatch not found"
        )
    # If the user is a volunteer, verify they are assigned to this dispatch
       
    if current_user.role == "VOLUNTEER":
        assigned_volunteer = (
            db.query(VolunteerProfile)
            .filter(
                VolunteerProfile.id == dispatch.volunteer_id,
                VolunteerProfile.user_id == current_user.id
            )
            .first()
        )

        if not assigned_volunteer:
            raise HTTPException(
                status_code=403,
                detail="You are not assigned to this dispatch"
            )

    # Get related rescue request
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

    # Check that the current user owns the related NGO
        # Only NGO users need to own the related NGO profile
    if current_user.role == "NGO":
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
        # Validate status based on user role
    if current_user.role == "VOLUNTEER":
        allowed_statuses = [
            "PICKED_UP",
            "DELIVERED"
        ]
    else:
        allowed_statuses = [
            "PENDING",
            "ASSIGNED",
            "PICKED_UP",
            "DELIVERED",
            "CANCELLED"
        ]

    if status not in allowed_statuses:
        raise HTTPException(
            status_code=403,
            detail="You are not allowed to set this dispatch status"
        )

    dispatch.status = status

        # Record impact when food is successfully delivered
    if status == "DELIVERED":

        existing_impact = (
            db.query(ImpactRecord)
            .filter(
                ImpactRecord.donation_id ==
                dispatch.rescue_request.donation_id
            )
            .first()
        )

        if not existing_impact:

            donation = (
                db.query(Donation)
                .filter(
                    Donation.id ==
                    dispatch.rescue_request.donation_id
                )
                .first()
            )

            if donation:
                rescued_kg = (
                    donation.quantity
                    if donation.unit.lower() in [
                        "kg",
                        "kgs",
                        "kilogram",
                        "kilograms"
                    ]
                    else 0
                )

                impact_record = ImpactRecord(
                    donation_id=donation.id,
                    rescued_food_kg=rescued_kg,
                    organic_recovery_kg=0,
                    successful_rescue=1
                )

                db.add(impact_record)

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