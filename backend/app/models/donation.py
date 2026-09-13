from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone

from app.database import Base


class Donation(Base):
    __tablename__ = "donations"

    id = Column(Integer, primary_key=True, index=True)

    donor_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    food_name = Column(String, nullable=False)
    food_category = Column(String, nullable=False)

    quantity = Column(Float, nullable=False)
    unit = Column(String, nullable=False)

    prepared_at = Column(DateTime, nullable=False)
    consume_before = Column(DateTime, nullable=False)

    storage_condition = Column(String, nullable=True)
    packaging_available = Column(Boolean, default=False)
    pickup_required = Column(Boolean, default=True)

    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)

    status = Column(
        String,
        default="AVAILABLE",
        nullable=False
    )

    created_at = Column(
    DateTime,
    default=lambda: datetime.now(timezone.utc)
)

    donor = relationship("User")