from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.ngo import NGOProfile
from app.models.user import User
from app.schemas.ngo import NGOCreate, NGOResponse
from app.dependencies.auth import get_current_user


router = APIRouter(
    prefix="/api/ngos",
    tags=["NGOs"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=NGOResponse)
def create_ngo(
    ngo: NGOCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Only NGO users can create NGO profiles
    if current_user.role != "NGO":
        raise HTTPException(
            status_code=403,
            detail="Only NGO users can create NGO profiles"
        )

    existing_ngo = (
        db.query(NGOProfile)
        .filter(NGOProfile.user_id == current_user.id)
        .first()
    )

    if existing_ngo:
        raise HTTPException(
            status_code=400,
            detail="NGO profile already exists"
        )

    new_ngo = NGOProfile(
        user_id=current_user.id,
        organization_name=ngo.organization_name,
        address=ngo.address,
        latitude=ngo.latitude,
        longitude=ngo.longitude,
        capacity=ngo.capacity
    )

    db.add(new_ngo)
    db.commit()
    db.refresh(new_ngo)

    return new_ngo


@router.get("/my", response_model=NGOResponse)
def get_my_ngo(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    ngo = (
        db.query(NGOProfile)
        .filter(NGOProfile.user_id == current_user.id)
        .first()
    )

    if not ngo:
        raise HTTPException(
            status_code=404,
            detail="NGO profile not found"
        )

    return ngo


@router.put("/my", response_model=NGOResponse)
def update_my_ngo(
    ngo: NGOCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "NGO":
        raise HTTPException(
            status_code=403,
            detail="Only NGO users can update NGO profiles"
        )

    existing_ngo = (
        db.query(NGOProfile)
        .filter(NGOProfile.user_id == current_user.id)
        .first()
    )

    if not existing_ngo:
        raise HTTPException(
            status_code=404,
            detail="NGO profile not found"
        )

    existing_ngo.organization_name = ngo.organization_name
    existing_ngo.address = ngo.address
    existing_ngo.latitude = ngo.latitude
    existing_ngo.longitude = ngo.longitude
    existing_ngo.capacity = ngo.capacity

    db.commit()
    db.refresh(existing_ngo)

    return existing_ngo


@router.get("/", response_model=list[NGOResponse])
def get_ngos(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    ngos = (
        db.query(NGOProfile)
        .filter(
            NGOProfile.verification_status == "VERIFIED",
            NGOProfile.capacity > 0
        )
        .order_by(NGOProfile.id.desc())
        .all()
    )

    return ngos


@router.patch("/{ngo_id}/verify", response_model=NGOResponse)
def verify_ngo(
    ngo_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Only administrators can verify NGOs
    if current_user.role != "ADMIN":
        raise HTTPException(
            status_code=403,
            detail="Only administrators can verify NGOs"
        )

    ngo = (
        db.query(NGOProfile)
        .filter(NGOProfile.id == ngo_id)
        .first()
    )

    if not ngo:
        raise HTTPException(
            status_code=404,
            detail="NGO profile not found"
        )

    ngo.verification_status = "VERIFIED"

    db.commit()
    db.refresh(ngo)

    return ngo