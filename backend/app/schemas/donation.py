from pydantic import BaseModel, Field, model_validator
from datetime import datetime


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
        if self.consume_before <= self.prepared_at:
            raise ValueError(
                "consume_before must be later than prepared_at"
            )
        return self


class DonationResponse(DonationCreate):
    id: int
    donor_id: int
    status: str

    class Config:
        from_attributes = True