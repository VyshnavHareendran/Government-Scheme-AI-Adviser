from getpass import getpass

from app.core.security import hash_password
from app.database.session import SessionLocal
from app.models.user import User


def main():
    db = SessionLocal()

    try:
        email = input("Admin email: ").strip().lower()
        new_password = getpass("New password: ")

        if len(new_password) < 8:
            raise ValueError(
                "Password must be at least 8 characters long."
            )

        user = (
            db.query(User)
            .filter(User.email == email)
            .first()
        )

        if not user:
            print("User not found.")
            return

        if user.role != "admin":
            print(
                f"User exists but role is '{user.role}', not admin."
            )
            return

        user.password_hash = hash_password(new_password)
        user.must_change_password = False

        db.commit()

        print()
        print("Admin password reset successfully.")
        print(f"Email: {user.email}")

    except Exception:
        db.rollback()
        raise

    finally:
        db.close()


if __name__ == "__main__":
    main()