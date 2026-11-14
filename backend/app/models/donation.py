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

    safety_checklist = relationship(
        "DonationSafetyCheck",
        uselist=False,
        lazy="joined"
    )

    @property
    def donor_name(self):
        return self.donor.name if self.donor else None


    # --- Rescue decision (computed, not stored) -----------------------
    # Scores depend on the current time, so they are worked out on read.
    # Routes may call score_for(ngo) first to include an NGO's distance.

    def score_for(self, ngo=None):
        from app.services.donation_scoring import score_donation

        self.__dict__["_rescue_decision"] = score_donation(self, ngo)
        return self.__dict__["_rescue_decision"]

    def _decision(self):
        cached = self.__dict__.get("_rescue_decision")
        return cached if cached is not None else self.score_for()

    @property
    def priority(self):
        return self._decision()["priority"]

    @property
    def priority_score(self):
        return self._decision()["priority_score"]

    @property
    def urgency(self):
        return self._decision()["urgency"]

    @property
    def hours_remaining(self):
        return self._decision()["hours_remaining"]

    @property
    def recovery_path(self):
        return self._decision()["recovery_path"]

    @property
    def recommended_action(self):
        return self._decision()["recommended_action"]

    @property
    def distance_to_ngo_km(self):
        return self._decision()["distance_to_ngo_km"]
