from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base


class VolunteerProfile(Base):
    __tablename__ = "volunteer_profiles"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        unique=True,
        nullable=False
    )

    vehicle_type = Column(String, nullable=True)

    availability_status = Column(
        String,
        default="AVAILABLE",
        nullable=False
    )

    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)

    user = relationship("User")