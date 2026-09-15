import os

from dotenv import load_dotenv
from app.database import SessionLocal
from app.models.user import User
from pwdlib import PasswordHash

load_dotenv()

password_hash = PasswordHash.recommended()

admin_email = os.getenv("ADMIN_EMAIL")
admin_password = os.getenv("ADMIN_PASSWORD")

if not admin_email or not admin_password:
    raise RuntimeError(
        "ADMIN_EMAIL and ADMIN_PASSWORD environment variables "
        "must be configured"
    )

db = SessionLocal()

try:
    existing_user = (
        db.query(User)
        .filter(User.email == admin_email)
        .first()
    )

    if existing_user:
        existing_user.role = "ADMIN"
        existing_user.password_hash = password_hash.hash(
            admin_password
        )
        db.commit()

        print("Admin account updated successfully.")

    else:
        admin = User(
            name="RasoiGrid Admin",
            email=admin_email,
            phone="9999999999",
            password_hash=password_hash.hash(
                admin_password
            ),
            role="ADMIN",
        )

        db.add(admin)
        db.commit()

        print("Admin account created successfully.")

finally:
    db.close()