from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.volunteer import VolunteerProfile
from app.models.user import User
from app.models.donation import Donation
from app.schemas.volunteer import VolunteerCreate, VolunteerResponse
from app.dependencies.auth import get_current_user


router = APIRouter(
    prefix="/api/volunteers",
    tags=["Volunteers"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=VolunteerResponse)
def create_volunteer(
    volunteer: VolunteerCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Only volunteer users can create volunteer profiles
    if current_user.role != "VOLUNTEER":
        raise HTTPException(
            status_code=403,
            detail="Only volunteer users can create volunteer profiles"
        )

    existing = (
        db.query(VolunteerProfile)
        .filter(VolunteerProfile.user_id == current_user.id)
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Volunteer profile already exists"
        )

    new_volunteer = VolunteerProfile(
        user_id=current_user.id,
        vehicle_type=volunteer.vehicle_type,
        latitude=volunteer.latitude,
        longitude=volunteer.longitude
    )

    db.add(new_volunteer)
    db.commit()
    db.refresh(new_volunteer)

    return new_volunteer


@router.get("/my", response_model=VolunteerResponse)
def get_my_volunteer(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    volunteer = (
        db.query(VolunteerProfile)
        .filter(VolunteerProfile.user_id == current_user.id)
        .first()
    )

    if not volunteer:
        raise HTTPException(
            status_code=404,
            detail="Volunteer profile not found"
        )

    return volunteer


@router.put("/my", response_model=VolunteerResponse)
def update_my_volunteer(
    volunteer: VolunteerCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Only volunteer users can update volunteer profiles
    if current_user.role != "VOLUNTEER":
        raise HTTPException(
            status_code=403,
            detail="Only volunteer users can update volunteer profiles"
        )

    existing = (
        db.query(VolunteerProfile)
        .filter(VolunteerProfile.user_id == current_user.id)
        .first()
    )

    if not existing:
        raise HTTPException(
            status_code=404,
            detail="Volunteer profile not found"
        )

    existing.vehicle_type = volunteer.vehicle_type
    existing.latitude = volunteer.latitude
    existing.longitude = volunteer.longitude

    db.commit()
    db.refresh(existing)

    return existing


@router.patch("/my/availability", response_model=VolunteerResponse)
def update_availability(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Only volunteer users can change availability
    if current_user.role != "VOLUNTEER":
        raise HTTPException(
            status_code=403,
            detail="Only volunteer users can change availability"
        )

    volunteer = (
        db.query(VolunteerProfile)
        .filter(VolunteerProfile.user_id == current_user.id)
        .first()
    )

    if not volunteer:
        raise HTTPException(
            status_code=404,
            detail="Volunteer profile not found"
        )

    if volunteer.availability_status == "AVAILABLE":
        volunteer.availability_status = "UNAVAILABLE"
    else:
        volunteer.availability_status = "AVAILABLE"

    db.commit()
    db.refresh(volunteer)

    return volunteer


@router.get(
    "/{donation_id}/volunteers",
    response_model=list[VolunteerResponse]
)
def get_donation_volunteers(
    donation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Only the donation owner can request volunteer matches
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

    volunteers = (
        db.query(VolunteerProfile)
        .filter(
            VolunteerProfile.availability_status == "AVAILABLE"
        )
        .all()
    )

    def distance(volunteer):
        if (
            donation.latitude is None
            or donation.longitude is None
            or volunteer.latitude is None
            or volunteer.longitude is None
        ):
            return float("inf")

        lat_diff = volunteer.latitude - donation.latitude
        lon_diff = volunteer.longitude - donation.longitude

        return (lat_diff ** 2 + lon_diff ** 2) ** 0.5

    volunteers.sort(key=distance)

    return volunteers