from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.volunteer import VolunteerProfile
from app.models.user import User
from app.models.donation import Donation
from app.schemas.volunteer import VolunteerCreate, VolunteerResponse
from app.dependencies.auth import get_current_user
from app.services.volunteer import rank_volunteers
from app.services.matching import calculate_distance


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
    if current_user.role != "VOLUNTEER":
        raise HTTPException(
            status_code=403,
            detail="Only volunteer users can view volunteer profile"
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

        return calculate_distance(
            donation.latitude,
            donation.longitude,
            volunteer.latitude,
            volunteer.longitude,
        )

    volunteers.sort(key=distance)

    return volunteers


@router.get("/available", response_model=list[VolunteerResponse])
def get_available_volunteers(
    donation_id: int | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    List available volunteers for an NGO to assign.

    When donation_id is given, the best-matched volunteers for that
    pickup come first.
    """
    if current_user.role != "NGO":
        raise HTTPException(
            status_code=403,
            detail="Only NGO users can view available volunteers"
        )

    volunteers = (
        db.query(VolunteerProfile)
        .filter(VolunteerProfile.availability_status == "AVAILABLE")
        .all()
    )

    donation = None
    if donation_id is not None:
        donation = (
            db.query(Donation)
            .filter(Donation.id == donation_id)
            .first()
        )

    if (
        donation is None
        or donation.latitude is None
        or donation.longitude is None
    ):
        return volunteers

    # Rank with the volunteer matching engine (distance and vehicle).
    # Ties go to the nearer volunteer; volunteers without a location go last.
    ranked = rank_volunteers(
        pickup_latitude=donation.latitude,
        pickup_longitude=donation.longitude,
        volunteers=volunteers
    )
    matches = {m["volunteer_id"]: m for m in ranked}

    for volunteer in volunteers:
        match = matches.get(volunteer.id)
        volunteer.distance_km = match["distance_km"] if match else None
        volunteer.match_score = match["match_score"] if match else None

    volunteers.sort(
        key=lambda v: (
            v.match_score is None,
            -(v.match_score or 0),
            v.distance_km if v.distance_km is not None else float("inf")
        )
    )

    return volunteers

