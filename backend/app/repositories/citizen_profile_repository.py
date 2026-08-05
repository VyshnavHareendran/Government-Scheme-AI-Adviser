from sqlalchemy.orm import Session

from app.models.citizen_profile import CitizenProfile
from app.schemas.citizen_profile import (
    CitizenProfileCreate,
    CitizenProfileUpdate,
)


class CitizenProfileRepository:

    @staticmethod
    def create(
        db: Session,
        user_id: int,
        profile: CitizenProfileCreate,
    ) -> CitizenProfile:
        db_profile = CitizenProfile(
            user_id=user_id,
            **profile.model_dump(),
        )

        db.add(db_profile)
        db.commit()
        db.refresh(db_profile)

        return db_profile

    @staticmethod
    def get_by_user_id(
        db: Session,
        user_id: int,
    ) -> CitizenProfile | None:
        return (
            db.query(CitizenProfile)
            .filter(CitizenProfile.user_id == user_id)
            .first()
        )

    @staticmethod
    def update(
        db: Session,
        db_profile: CitizenProfile,
        profile: CitizenProfileUpdate,
    ) -> CitizenProfile:

        update_data = profile.model_dump(exclude_unset=True)

        for key, value in update_data.items():
            setattr(db_profile, key, value)

        db.commit()
        db.refresh(db_profile)

        return db_profile

    @staticmethod
    def delete(
        db: Session,
        db_profile: CitizenProfile,
    ) -> None:

        db.delete(db_profile)
        db.commit()