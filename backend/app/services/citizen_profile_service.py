from sqlalchemy.orm import Session

from app.models.citizen_profile import CitizenProfile
from app.repositories.citizen_profile_repository import (
    CitizenProfileRepository,
)
from app.schemas.citizen_profile import (
    CitizenProfileCreate,
    CitizenProfileUpdate,
)


class CitizenProfileService:

    @staticmethod
    def create_profile(
        db: Session,
        user_id: int,
        profile: CitizenProfileCreate,
    ) -> CitizenProfile:

        existing_profile = CitizenProfileRepository.get_by_user_id(
            db,
            user_id,
        )

        if existing_profile:
            raise ValueError("Citizen profile already exists.")

        return CitizenProfileRepository.create(
            db,
            user_id,
            profile,
        )

    @staticmethod
    def get_profile(
        db: Session,
        user_id: int,
    ) -> CitizenProfile | None:

        return CitizenProfileRepository.get_by_user_id(
            db,
            user_id,
        )

    @staticmethod
    def update_profile(
        db: Session,
        user_id: int,
        profile: CitizenProfileUpdate,
    ) -> CitizenProfile:

        db_profile = CitizenProfileRepository.get_by_user_id(
            db,
            user_id,
        )

        if not db_profile:
            raise ValueError("Citizen profile not found.")

        return CitizenProfileRepository.update(
            db,
            db_profile,
            profile,
        )

    @staticmethod
    def delete_profile(
        db: Session,
        user_id: int,
    ) -> None:

        db_profile = CitizenProfileRepository.get_by_user_id(
            db,
            user_id,
        )

        if not db_profile:
            raise ValueError("Citizen profile not found.")

        CitizenProfileRepository.delete(
            db,
            db_profile,
        )