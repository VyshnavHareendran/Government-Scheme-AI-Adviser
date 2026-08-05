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

    def authenticate(self, email: str, password: str) -> str:
        user = self.repository.get_by_email(email)

        if not user:
            raise ValueError("Invalid email or password.")

        if not verify_password(password, user.password_hash):
            raise ValueError("Invalid email or password.")

        return create_access_token(subject=str(user.id))