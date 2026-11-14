from pydantic import BaseModel


class VolunteerCreate(BaseModel):
    vehicle_type: str | None = None
    latitude: float | None = None
    longitude: float | None = None


class VolunteerResponse(VolunteerCreate):
    id: int
    user_id: int
    availability_status: str
    name: str | None = None
    phone: str | None = None

    # Filled in by /api/volunteers/available when a donation is given
    distance_km: float | None = None
    match_score: int | None = None

    class Config:
        from_attributes = True