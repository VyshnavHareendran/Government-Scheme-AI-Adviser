from sqlalchemy.orm import Session, joinedload

from app.models.application import Application


class ApplicationRepository:

    @staticmethod
    def create(
        db: Session,
        citizen_id: int,
        scheme_id: int,
    ) -> Application:

        application = Application(
            citizen_id=citizen_id,
            scheme_id=scheme_id,
            status="Not Started",
        )

        db.add(application)
        db.commit()
        db.refresh(application)

        return application

    @staticmethod
    def get_by_id(
        db: Session,
        application_id: int,
    ) -> Application | None:

        return (
            db.query(Application)
            .options(joinedload(Application.scheme))
            .filter(Application.id == application_id)
            .first()
        )

    @staticmethod
    def get_by_citizen(
        db: Session,
        citizen_id: int,
    ) -> list[Application]:

        return (
            db.query(Application)
            .options(joinedload(Application.scheme))
            .filter(Application.citizen_id == citizen_id)
            .order_by(Application.created_at.desc())
            .all()
        )

    @staticmethod
    def get_all(
        db: Session,
    ) -> list[Application]:

        return (
            db.query(Application)
            .options(joinedload(Application.scheme))
            .order_by(Application.created_at.desc())
            .all()
        )

    @staticmethod
    def update_status(
        db: Session,
        application: Application,
        status: str,
        notes: str | None = None,
    ) -> Application:

        application.status = status
        application.notes = notes

        db.commit()
        db.refresh(application)

        return application
