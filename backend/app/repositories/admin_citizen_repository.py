from sqlalchemy.orm import Session, joinedload

from app.models.user import User


class AdminCitizenRepository:

    @staticmethod
    def get_citizens(
        db: Session,
        search: str | None = None,
        status_filter: str = "all",
    ) -> list[User]:

        query = (
            db.query(User)
            .options(joinedload(User.citizen_profile))
            .filter(User.role == "citizen")
        )

        if search:
            search_term = f"%{search.strip()}%"

            query = query.filter(
                (User.full_name.ilike(search_term))
                | (User.email.ilike(search_term))
            )

        if status_filter == "active":
            query = query.filter(User.is_active.is_(True))

        elif status_filter == "inactive":
            query = query.filter(User.is_active.is_(False))

        return (
            query
            .order_by(User.created_at.desc())
            .all()
        )

    @staticmethod
    def get_citizen_by_id(
        db: Session,
        citizen_id: int,
    ) -> User | None:

        return (
            db.query(User)
            .options(joinedload(User.citizen_profile))
            .filter(
                User.id == citizen_id,
                User.role == "citizen",
            )
            .first()
        )