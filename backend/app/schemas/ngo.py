from pydantic import BaseModel, Field


class NGOCreate(BaseModel):
    organization_name: str = Field(min_length=2, max_length=150)
    address: str = Field(min_length=5, max_length=300)
    latitude: float | None = None
    longitude: float | None = None
    capacity: int = Field(gt=0)


class NGOResponse(NGOCreate):
    id: int
    user_id: int
    verification_status: str

    class Config:
        from_attributes = True