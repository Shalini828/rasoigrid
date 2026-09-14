import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text


from app.database import engine, Base
from app.models.user import User
from app.models.donor import DonorProfile
from app.models.ngo import NGOProfile
from app.models.volunteer import VolunteerProfile
from app.models.donation import Donation
from app.routes.auth import router as auth_router
from app.routes.donations import router as donation_router
from app.routes.ngo import router as ngo_router
from app.routes.volunteer import router as volunteer_router
from app.routes.rescue_requests import router as rescue_requests_router
from app.models.dispatch import Dispatch
from app.models.impact import ImpactRecord
from app.routes.dispatch import router as dispatch_router
from app.routes.prediction import router as prediction_router
from app.routes.impact import router as impact_router

app = FastAPI(title="RasoiGrid API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        os.getenv(
            "FRONTEND_URL",
            "http://localhost:5173"
        )
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)
app.include_router(auth_router)
app.include_router(donation_router)
app.include_router(ngo_router)
app.include_router(volunteer_router)
app.include_router(rescue_requests_router)
app.include_router(dispatch_router)
app.include_router(prediction_router)
app.include_router(impact_router)


@app.get("/")
def home():
    return {
        "message": "RasoiGrid backend is running!"
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "RasoiGrid API"
    }