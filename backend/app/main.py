from fastapi import FastAPI
from sqlalchemy import text


from app.database import engine, Base
from app.models.user import User
from app.models.donor import DonorProfile
from app.models.ngo import NGOProfile
from app.models.volunteer import VolunteerProfile
from app.models.donation import Donation
from app.routes.auth import router as auth_router
from app.routes.donations import router as donation_router

app = FastAPI(title="RasoiGrid API")
Base.metadata.create_all(bind=engine)
app.include_router(auth_router)
app.include_router(donation_router)

@app.get("/")
def home():
    return {
        "message": "RasoiGrid backend is running!"
    }


@app.get("/test-db")
def test_database():
    with engine.connect() as connection:
        result = connection.execute(text("SELECT current_database()"))
        database_name = result.scalar()

    return {
        "database": database_name,
        "status": "connected"
    }