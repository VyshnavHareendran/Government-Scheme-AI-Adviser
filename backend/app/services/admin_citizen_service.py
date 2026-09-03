from sqlalchemy.orm import Session

from app.models.user import User
from app.repositories.admin_citizen_repository import (
    AdminCitizenRepository,
)


class AdminCitizenService:

    @staticmethod
    def get_citizens(
        db: Session,
        search: str | None = None,
        status_filter: str = "all",
    ) -> list[User]:

        return AdminCitizenRepository.get_citizens(
            db=db,
            search=search,
            status_filter=status_filter,
        )

    @staticmethod
    def get_citizen(
        db: Session,
        citizen_id: int,
    ) -> User | None:

        return AdminCitizenRepository.get_citizen_by_id(
            db=db,
            citizen_id=citizen_id,
        )