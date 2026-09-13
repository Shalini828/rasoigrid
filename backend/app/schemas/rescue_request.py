from pydantic import BaseModel


class RescueRequestCreate(BaseModel):
    donation_id: int
    ngo_id: int


class RescueRequestResponse(BaseModel):
    id: int
    donation_id: int
    ngo_id: int
    status: str

    class Config:
        from_attributes = True