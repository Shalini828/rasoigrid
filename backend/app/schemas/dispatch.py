from pydantic import BaseModel


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

    class Config:
        from_attributes = True