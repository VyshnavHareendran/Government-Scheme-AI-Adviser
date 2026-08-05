from collections.abc import Generator

from sqlalchemy.orm import Session

from app.database.session import SessionLocal

from fastapi import Depends, HTTPException, status

from app.core.security import decode_access_token, oauth2_scheme

from app.models.user import User
from app.repositories.user_repository import UserRepository


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    try:
        payload = decode_access_token(token)

        user_id = payload.get("sub")

        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials.",
            )

        repository = UserRepository(db)
        user = repository.get_by_id(int(user_id))

        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found.",
            )

        return user

    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token.",
        )