from datetime import datetime, timezone

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String

from app.database import Base


class DonationSafetyCheck(Base):
    """
    The donor's food-safety declaration for a donation.

    This records what the donor confirmed when listing the food.
    It is a declaration, not an inspection: final food-safety
    decisions stay with the receiving organisation.

    Kept in its own table so existing databases gain it through
    create_all without altering the donations table.
    """

    __tablename__ = "donation_safety_checks"

    id = Column(Integer, primary_key=True, index=True)

    donation_id = Column(
        Integer,
        ForeignKey("donations.id"),
        nullable=False,
        unique=True,
        index=True
    )

    hygienic_preparation = Column(Boolean, nullable=False)
    safe_temperature = Column(Boolean, nullable=False)
    covered_and_labelled = Column(Boolean, nullable=False)
    no_spoilage_signs = Column(Boolean, nullable=False)

    allergens = Column(String, nullable=True)

    declared_by = Column(Integer, ForeignKey("users.id"), nullable=False)

    declared_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )
