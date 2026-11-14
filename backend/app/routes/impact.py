from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies.auth import get_current_user
from app.models.dispatch import Dispatch
from app.models.impact import ImpactRecord
from app.models.ngo import NGOProfile
from app.models.rescue_request import RescueRequest
from app.models.user import User
from app.models.volunteer import VolunteerProfile
from app.services.impact import calculate_impact
from app.models.donation import Donation

router = APIRouter(
    prefix="/api/impact",
    tags=["Impact"]
)


@router.get("/")
def get_impact(
    db: Session = Depends(get_db)
):
    records = db.query(ImpactRecord).all()

    rescued_food_kg = sum(
        record.rescued_food_kg or 0
        for record in records
    )

    organic_recovery_kg = sum(
        record.organic_recovery_kg or 0
        for record in records
    )

    successful_rescues = sum(
        record.successful_rescue or 0
        for record in records
    )

    total_donations = db.query(Donation).count()

    return calculate_impact(
        rescued_food_kg=rescued_food_kg,
        organic_recovery_kg=organic_recovery_kg,
        successful_rescues=successful_rescues,
        total_donations=total_donations
    )


def _impact_for(records, total_donations):
    return calculate_impact(
        rescued_food_kg=sum(r.rescued_food_kg or 0 for r in records),
        organic_recovery_kg=sum(r.organic_recovery_kg or 0 for r in records),
        successful_rescues=sum(r.successful_rescue or 0 for r in records),
        total_donations=total_donations
    )


@router.get("/me")
def get_my_impact(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Impact for the logged-in user only.

    Donor: their donations. NGO: donations it accepted.
    Volunteer: pickups assigned to them. Admin: the whole network.
    total_donations counts what the rate is measured against.
    """

    if current_user.role == "DONOR":
        donation_ids = db.query(Donation.id).filter(
            Donation.donor_id == current_user.id
        )
        total = donation_ids.count()

    elif current_user.role == "NGO":
        ngo = db.query(NGOProfile).filter(
            NGOProfile.user_id == current_user.id
        ).first()
        donation_ids = db.query(RescueRequest.donation_id).filter(
            RescueRequest.ngo_id == (ngo.id if ngo else -1),
            RescueRequest.status == "ACCEPTED"
        )
        total = donation_ids.count()

    elif current_user.role == "VOLUNTEER":
        volunteer = db.query(VolunteerProfile).filter(
            VolunteerProfile.user_id == current_user.id
        ).first()
        donation_ids = (
            db.query(RescueRequest.donation_id)
            .join(Dispatch, Dispatch.rescue_request_id == RescueRequest.id)
            .filter(
                Dispatch.volunteer_id == (volunteer.id if volunteer else -1)
            )
        )
        total = donation_ids.count()

    else:
        return get_impact(db)

    records = (
        db.query(ImpactRecord)
        .filter(ImpactRecord.donation_id.in_(donation_ids.scalar_subquery()))
        .all()
    )

    return _impact_for(records, total)
