from datetime import datetime, timezone

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey

from app.database import Base


class DeliveryCode(Base):
    """
    One-time handover code for a dispatch.

    The receiving NGO sees the code. The volunteer must enter it
    to mark the food as delivered, which proves the NGO received it.

    Kept in its own table so existing databases gain it through
    create_all without altering the dispatches table.
    """

    __tablename__ = "delivery_codes"

    id = Column(Integer, primary_key=True, index=True)

    dispatch_id = Column(
        Integer,
        ForeignKey("dispatches.id"),
        nullable=False,
        unique=True,
        index=True
    )

    code = Column(String, nullable=False)

    failed_attempts = Column(Integer, default=0, nullable=False)

    created_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    confirmed_at = Column(DateTime, nullable=True)
