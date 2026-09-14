from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.donation import Donation
from app.schemas.donation import DonationCreate, DonationResponse
from app.schemas.ngo import NGOResponse
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.models.ngo import NGOProfile

router = APIRouter(
    prefix="/api/donations",
    tags=["Donations"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=DonationResponse)
def create_donation(
    donation: DonationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    if current_user.role != "DONOR":
        raise HTTPException(
            status_code=403,
            detail="Only donors can create donations"
        )
    new_donation = Donation(
        donor_id=current_user.id,  
        food_name=donation.food_name,
        food_category=donation.food_category,
        quantity=donation.quantity,
        unit=donation.unit,
        prepared_at=donation.prepared_at,
        consume_before=donation.consume_before,
        storage_condition=donation.storage_condition,
        packaging_available=donation.packaging_available,
        pickup_required=donation.pickup_required,
        latitude=donation.latitude,
        longitude=donation.longitude
    )

    db.add(new_donation)
    db.commit()
    db.refresh(new_donation)

    return new_donation

@router.get("/", response_model=list[DonationResponse])
def get_donations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    donations = (
        db.query(Donation)
        .filter(Donation.status == "AVAILABLE")
        .order_by(Donation.created_at.desc())
        .all()
    )

    return donations


@router.get("/my", response_model=list[DonationResponse])
def get_my_donations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    donations = (
        db.query(Donation)
        .filter(Donation.donor_id == current_user.id)
        .order_by(Donation.created_at.desc())
        .all()
    )

    return donations


@router.put("/{donation_id}", response_model=DonationResponse)
def update_donation(
    donation_id: int,
    donation: DonationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    existing_donation = (
        db.query(Donation)
        .filter(
            Donation.id == donation_id,
            Donation.donor_id == current_user.id
        )
        .first()
    )

    if not existing_donation:
        raise HTTPException(
            status_code=404,
            detail="Donation not found"
        )

    existing_donation.food_name = donation.food_name
    existing_donation.food_category = donation.food_category
    existing_donation.quantity = donation.quantity
    existing_donation.unit = donation.unit
    existing_donation.prepared_at = donation.prepared_at
    existing_donation.consume_before = donation.consume_before
    existing_donation.storage_condition = donation.storage_condition
    existing_donation.packaging_available = donation.packaging_available
    existing_donation.pickup_required = donation.pickup_required
    existing_donation.latitude = donation.latitude
    existing_donation.longitude = donation.longitude

    db.commit()
    db.refresh(existing_donation)

    return existing_donation


@router.patch("/{donation_id}/cancel", response_model=DonationResponse)
def cancel_donation(
    donation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    donation = (
        db.query(Donation)
        .filter(
            Donation.id == donation_id,
            Donation.donor_id == current_user.id
        )
        .first()
    )

    if not donation:
        raise HTTPException(
            status_code=404,
            detail="Donation not found"
        )

    if donation.status != "AVAILABLE":
        raise HTTPException(
            status_code=400,
            detail="Only available donations can be cancelled"
        )

    donation.status = "CANCELLED"

    db.commit()
    db.refresh(donation)

    return donation


@router.get("/{donation_id}/matches", response_model=list[NGOResponse])
def get_donation_matches(
    donation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    donation = (
        db.query(Donation)
        .filter(
            Donation.id == donation_id,
            Donation.donor_id == current_user.id
        )
        .first()
    )

    if not donation:
        raise HTTPException(
            status_code=404,
            detail="Donation not found"
        )

    ngos = (
        db.query(NGOProfile)
        .filter(
            NGOProfile.verification_status == "VERIFIED",
            NGOProfile.capacity > 0
        )
        .all()
    )

    def distance(ngo):
        if (
            donation.latitude is None
            or donation.longitude is None
            or ngo.latitude is None
            or ngo.longitude is None
        ):
            return float("inf")

        lat_diff = ngo.latitude - donation.latitude
        lon_diff = ngo.longitude - donation.longitude

        return (lat_diff ** 2 + lon_diff ** 2) ** 0.5

    ngos.sort(key=distance)

    return ngos
