from app.core.security import (
    create_access_token,
    hash_password,
    verify_password,
)
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.auth import UserCreate


class AuthService:
    def __init__(self, repository: UserRepository):
        self.repository = repository

    def register(self, user_data: UserCreate) -> User:
        existing_user = self.repository.get_by_email(user_data.email)

        if existing_user:
            raise ValueError("Email is already registered.")

        user = User(
            full_name=user_data.full_name,
            email=user_data.email,
            password_hash=hash_password(user_data.password),
            role="citizen",
        )

        return self.repository.create(user)

    def authenticate(
        self,
        email: str,
        password: str,
    ) -> tuple[str, bool]:
        user = self.repository.get_by_email(email)

        if not user:
            raise ValueError("Invalid email or password.")

        if not user.is_active:
            raise ValueError("Your account is inactive. Please contact an administrator.")

        if not verify_password(
            password,
            user.password_hash,
        ):
            raise ValueError("Invalid email or password.")

        token = create_access_token(
            subject=str(user.id)
        )

        return token, user.must_change_password

    def change_password(
        self,
        user: User,
        current_password: str,
        new_password: str,
    ) -> User:
        if not verify_password(
            current_password,
            user.password_hash,
        ):
            raise ValueError(
                "Current password is incorrect."
            )

        if current_password == new_password:
            raise ValueError(
                "New password must be different from the current password."
            )

        if len(new_password) < 8:
            raise ValueError(
                "New password must be at least 8 characters long."
            )

        return self.repository.update_password(
            user=user,
            password_hash=hash_password(new_password),
            must_change_password=False,
        )