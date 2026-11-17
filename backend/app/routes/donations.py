from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.donation import Donation
from app.schemas.donation import DonationCreate, DonationResponse
from app.schemas.ngo import NGOResponse
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.models.ngo import NGOProfile
from app.models.safety_check import DonationSafetyCheck
from app.services.matching import calculate_distance
from app.services.audit import create_audit_event
from app.services.notifications import notify, verified_ngo_user_ids
from app.services.expiry import expire_stale_donations

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
    db.flush()

    if donation.safety_checklist is not None:
        checklist = donation.safety_checklist
        db.add(DonationSafetyCheck(
            donation_id=new_donation.id,
            hygienic_preparation=checklist.hygienic_preparation,
            safe_temperature=checklist.safe_temperature,
            covered_and_labelled=checklist.covered_and_labelled,
            no_spoilage_signs=checklist.no_spoilage_signs,
            allergens=(checklist.allergens or "").strip() or None,
            declared_by=current_user.id
        ))

    db.commit()
    db.refresh(new_donation)

    create_audit_event(
        donation_id=new_donation.id,
        action="DONATED",
        actor_type="DONOR",
        actor_id=current_user.id,
        details="Donation created",
        db=db
    )

    notify(
        db,
        verified_ngo_user_ids(db),
        f"New food listed: {new_donation.food_name} "
        f"({new_donation.quantity:g} {new_donation.unit})",
        link="/app/command",
    )

    return new_donation

@router.get("/", response_model=list[DonationResponse])
def get_donations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "NGO":
        raise HTTPException(
            status_code=403,
            detail="Only NGO users can view available donations"
        )

    expire_stale_donations(db)

    donations = (
        db.query(Donation)
        .filter(Donation.status == "AVAILABLE")
        .all()
    )

    # Score each donation for this NGO (distance and capacity count),
    # then put the most urgent first.
    ngo = (
        db.query(NGOProfile)
        .filter(NGOProfile.user_id == current_user.id)
        .first()
    )

    for donation in donations:
        donation.score_for(ngo)

    donations.sort(
        key=lambda d: (-d.priority_score, d.consume_before)
    )

    return donations


@router.get("/my", response_model=list[DonationResponse])
def get_my_donations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    expire_stale_donations(db)

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

    if existing_donation.status != "AVAILABLE":
      raise HTTPException(
        status_code=400,
        detail="Only available donations can be updated"
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

    create_audit_event(
        donation_id=donation.id,
        action="CANCELLED",
        actor_type="DONOR",
        actor_id=current_user.id,
        details="Donation cancelled",
        db=db
    )

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
            NGOProfile.capacity >= donation.quantity
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

        return calculate_distance(
            donation.latitude,
            donation.longitude,
            ngo.latitude,
            ngo.longitude
        )

    ngos.sort(key=distance)

    return ngos
