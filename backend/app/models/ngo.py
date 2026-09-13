from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base


class NGOProfile(Base):
    __tablename__ = "ngo_profiles"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        unique=True,
        nullable=False
    )

    organization_name = Column(String, nullable=False)
    address = Column(String, nullable=False)

    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)

    capacity = Column(Integer, nullable=False)

    verification_status = Column(
        String,
        default="PENDING",
        nullable=False
    )

    user = relationship("User")