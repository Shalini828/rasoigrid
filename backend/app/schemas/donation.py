from pydantic import BaseModel, Field, model_validator
from datetime import datetime, timezone


class DonationCreate(BaseModel):
    food_name: str = Field(min_length=2, max_length=100)
    food_category: str
    quantity: float = Field(gt=0)
    unit: str

    prepared_at: datetime
    consume_before: datetime

    storage_condition: str | None = None
    packaging_available: bool = False
    pickup_required: bool = True

    latitude: float | None = None
    longitude: float | None = None

    @model_validator(mode="after")
    def validate_dates(self):
        # Store every time as UTC without an offset, so comparisons
        # with the current time work the same on any database.
        for field in ("prepared_at", "consume_before"):
            value = getattr(self, field)
            if value.tzinfo is not None:
                setattr(
                    self,
                    field,
                    value.astimezone(timezone.utc).replace(tzinfo=None)
                )

        if self.consume_before <= self.prepared_at:
            raise ValueError(
                "consume_before must be later than prepared_at"
            )
        return self


class DonationResponse(DonationCreate):
    id: int
    donor_id: int
    status: str
    created_at: datetime | None = None
    donor_name: str | None = None

    # Planning scores from the decision engine (not a food-safety check)
    priority: str | None = None
    priority_score: int | None = None
    urgency: str | None = None
    hours_remaining: float | None = None
    recovery_path: str | None = None
    recommended_action: str | None = None
    distance_to_ngo_km: float | None = None

    class Config:
        from_attributes = True