from datetime import datetime, timezone

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey

from app.database import Base


class AuditEvent(Base):
    __tablename__ = "audit_events"

    id = Column(Integer, primary_key=True, index=True)

    donation_id = Column(
        Integer,
        ForeignKey("donations.id"),
        nullable=False
    )

    action = Column(String, nullable=False)

    actor_type = Column(String, nullable=False)

    actor_id = Column(Integer, nullable=True)

    details = Column(String, nullable=True)

    timestamp = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )