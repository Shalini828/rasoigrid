from pydantic import BaseModel, EmailStr
from typing import Literal


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    password: str
    role: Literal["DONOR", "NGO", "VOLUNTEER", "ADMIN"]


class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    phone: str
    role: str

    class Config:
        from_attributes = True


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str       