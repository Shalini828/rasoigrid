from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.rescue_request import RescueRequest
from app.models.donation import Donation
from app.models.ngo import NGOProfile
from app.schemas.rescue_request import (
    RescueRequestCreate,
    RescueRequestResponse
)
from app.dependencies.auth import get_current_user
from app.models.user import User


router = APIRouter(
    prefix="/api/rescue-requests",
    tags=["Rescue Requests"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=RescueRequestResponse)
def create_rescue_request(
    request: RescueRequestCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # 1. Check that donation exists
    donation = (
        db.query(Donation)
        .filter(Donation.id == request.donation_id)
        .first()
    )

    if not donation:
        raise HTTPException(
            status_code=404,
            detail="Donation not found"
        )

    # 2. Donation must still be available
    if donation.status != "AVAILABLE":
        raise HTTPException(
            status_code=400,
            detail="Donation is not available"
        )

    # 3. Check that NGO exists and is verified
    ngo = (
        db.query(NGOProfile)
        .filter(
            NGOProfile.id == request.ngo_id,
            NGOProfile.user_id == current_user.id,
            NGOProfile.verification_status == "VERIFIED"
        )
        .first()
    )

    if not ngo:
        raise HTTPException(
            status_code=404,
            detail="Verified NGO not found"
        )

    # 4. Check for duplicate rescue request
    existing_request = (
        db.query(RescueRequest)
        .filter(
            RescueRequest.donation_id == request.donation_id,
            RescueRequest.ngo_id == request.ngo_id
        )
        .first()
    )

    if existing_request:
        raise HTTPException(
            status_code=400,
            detail="Rescue request already exists"
        )

    # 5. Create rescue request
    new_request = RescueRequest(
        donation_id=request.donation_id,
        ngo_id=request.ngo_id
    )

    db.add(new_request)
    db.commit()
    db.refresh(new_request)

    return new_request

@router.get("/my", response_model=list[RescueRequestResponse])
def get_my_rescue_requests(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    requests = (
        db.query(RescueRequest)
        .filter(
            RescueRequest.ngo_id.in_(
                db.query(NGOProfile.id)
                .filter(NGOProfile.user_id == current_user.id)
            )
        )
        .order_by(RescueRequest.id.desc())
        .all()
    )

    return requests


@router.patch("/{request_id}/status", response_model=RescueRequestResponse)
def update_rescue_request_status(
    request_id: int,
    status: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    rescue_request = (
        db.query(RescueRequest)
        .join(NGOProfile, RescueRequest.ngo_id == NGOProfile.id)
        .filter(
            RescueRequest.id == request_id,
            NGOProfile.user_id == current_user.id
        )
        .first()
    )

    if not rescue_request:
        raise HTTPException(
            status_code=404,
            detail="Rescue request not found"
        )

    if status not in ["ACCEPTED", "REJECTED"]:
        raise HTTPException(
            status_code=400,
            detail="Status must be ACCEPTED or REJECTED"
        )

    rescue_request.status = status

    if status == "ACCEPTED":
        donation = (
            db.query(Donation)
            .filter(Donation.id == rescue_request.donation_id)
            .first()
        )

        if donation:
            donation.status = "CLAIMED"

    db.commit()
    db.refresh(rescue_request)

    return rescue_request