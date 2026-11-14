from pydantic import BaseModel

from app.schemas.donation import DonationResponse


class RescueRequestCreate(BaseModel):
    donation_id: int
    ngo_id: int


class RescueRequestResponse(BaseModel):
    id: int
    donation_id: int
    ngo_id: int
    status: str
    donation: DonationResponse | None = None

    class Config:
        from_attributes = True