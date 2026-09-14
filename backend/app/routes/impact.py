from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.impact import ImpactRecord
from app.services.impact import calculate_impact

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

    total_donations = len(records)

    return calculate_impact(
        rescued_food_kg=rescued_food_kg,
        organic_recovery_kg=organic_recovery_kg,
        successful_rescues=successful_rescues,
        total_donations=total_donations
    )