from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base


class Dispatch(Base):
    __tablename__ = "dispatches"

    id = Column(Integer, primary_key=True, index=True)

    rescue_request_id = Column(
        Integer,
        ForeignKey("rescue_requests.id"),
        nullable=False
    )

    volunteer_id = Column(
        Integer,
        ForeignKey("volunteer_profiles.id"),
        nullable=True
    )

    pickup_latitude = Column(Float, nullable=True)
    pickup_longitude = Column(Float, nullable=True)

    delivery_latitude = Column(Float, nullable=True)
    delivery_longitude = Column(Float, nullable=True)

    status = Column(
        String,
        default="PENDING",
        nullable=False
    )

    rescue_request = relationship("RescueRequest")
    volunteer = relationship("VolunteerProfile")