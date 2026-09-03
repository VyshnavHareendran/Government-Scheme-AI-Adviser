from getpass import getpass

from app.core.security import hash_password
from app.database.session import SessionLocal
from app.models.user import User


def main():
    db = SessionLocal()

    try:
        print("=" * 60)
        print("CREATE ADMIN USER")
        print("=" * 60)

        full_name = input("Full name: ").strip()
        email = input("Email: ").strip().lower()
        password = getpass("Password: ")

        existing_user = (
            db.query(User)
            .filter(User.email == email)
            .first()
        )

        if existing_user:
            print()
            print("User already exists.")
            print(f"Current role: {existing_user.role}")

            confirm = input(
                "Make this user an admin? (y/n): "
            ).strip().lower()

            if confirm == "y":
                existing_user.role = "admin"
                existing_user.is_active = True

                db.commit()
                db.refresh(existing_user)

                print()
                print("Existing user promoted to admin successfully!")
                print(f"ID   : {existing_user.id}")
                print(f"Email: {existing_user.email}")
                print(f"Role : {existing_user.role}")

            return

        admin = User(
            full_name=full_name,
            email=email,
            password_hash=hash_password(password),
            role="admin",
            is_active=True,
        )

        db.add(admin)
        db.commit()
        db.refresh(admin)

        print()
        print("Admin created successfully!")
        print(f"ID   : {admin.id}")
        print(f"Name : {admin.full_name}")
        print(f"Email: {admin.email}")
        print(f"Role : {admin.role}")

    except Exception:
        db.rollback()
        raise

    finally:
        db.close()


if __name__ == "__main__":
    main()