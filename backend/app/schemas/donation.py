from pydantic import BaseModel
from datetime import datetime


class DonationCreate(BaseModel):
    food_name: str
    food_category: str
    quantity: float
    unit: str

    prepared_at: datetime
    consume_before: datetime

    storage_condition: str | None = None
    packaging_available: bool = False
    pickup_required: bool = True

    latitude: float | None = None
    longitude: float | None = None


class DonationResponse(DonationCreate):
    id: int
    donor_id: int
    status: str

    class Config:
        from_attributes = True