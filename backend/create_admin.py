from app.database import SessionLocal
from app.models.user import User
from pwdlib import PasswordHash

password_hash = PasswordHash.recommended()

db = SessionLocal()

try:
    email = "admin@rasoigrid.com"

    existing_user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if existing_user:
        existing_user.role = "ADMIN"
        existing_user.password_hash = password_hash.hash("Admin@12345")
        db.commit()

        print("Admin account updated successfully.")
    else:
        admin = User(
            name="RasoiGrid Admin",
            email=email,
            phone="9999999999",
            password_hash=password_hash.hash("Admin@12345"),
            role="ADMIN",
        )

        db.add(admin)
        db.commit()

        print("Admin account created successfully.")

    print("Email: admin@rasoigrid.com")
    print("Password: Admin@12345")

finally:
    db.close()