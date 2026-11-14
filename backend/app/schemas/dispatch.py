from pydantic import BaseModel

from app.schemas.donation import DonationResponse


class DispatchCreate(BaseModel):
    rescue_request_id: int
    volunteer_id: int | None = None

    pickup_latitude: float | None = None
    pickup_longitude: float | None = None

    delivery_latitude: float | None = None
    delivery_longitude: float | None = None


class DispatchResponse(DispatchCreate):
    id: int
    status: str
    donation: DonationResponse | None = None
    volunteer_name: str | None = None
    volunteer_phone: str | None = None
    ngo_name: str | None = None
    ngo_address: str | None = None

    class Config:
        from_attributes = True