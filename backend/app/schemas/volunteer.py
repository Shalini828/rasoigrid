from pydantic import BaseModel


class VolunteerCreate(BaseModel):
    vehicle_type: str | None = None
    latitude: float | None = None
    longitude: float | None = None


class VolunteerResponse(VolunteerCreate):
    id: int
    user_id: int
    availability_status: str

    class Config:
        from_attributes = True