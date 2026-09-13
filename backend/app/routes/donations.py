from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.donation import Donation
from app.schemas.donation import DonationCreate, DonationResponse
from app.dependencies.auth import get_current_user
from app.models.user import User
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
def get_my_donations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    donations = db.query(Donation).filter(
        Donation.donor_id == current_user.id
    ).all()

    return donations