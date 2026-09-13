from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base


class RescueRequest(Base):
    __tablename__ = "rescue_requests"

    id = Column(Integer, primary_key=True, index=True)

    donation_id = Column(
        Integer,
        ForeignKey("donations.id"),
        nullable=False
    )

    ngo_id = Column(
        Integer,
        ForeignKey("ngo_profiles.id"),
        nullable=False
    )

    status = Column(
        String,
        default="PENDING",
        nullable=False
    )

    donation = relationship("Donation")
    ngo = relationship("NGOProfile")