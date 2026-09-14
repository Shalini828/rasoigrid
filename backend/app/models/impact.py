from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone

from app.database import Base


class ImpactRecord(Base):
    __tablename__ = "impact_records"

    id = Column(Integer, primary_key=True, index=True)

    donation_id = Column(
        Integer,
        ForeignKey("donations.id"),
        nullable=False
    )

    rescued_food_kg = Column(
        Float,
        default=0
    )

    organic_recovery_kg = Column(
        Float,
        default=0
    )

    successful_rescue = Column(
        Integer,
        default=0
    )

    created_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc)
    )

    donation = relationship("Donation")