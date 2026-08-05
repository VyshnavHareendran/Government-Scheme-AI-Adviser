from sqlalchemy.orm import Session

from app.models.scheme import Scheme
from app.schemas.scheme import SchemeCreate, SchemeUpdate


class SchemeRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, scheme: SchemeCreate) -> Scheme:
        data = scheme.model_dump(mode="json")

        db_scheme = Scheme(**data)

        self.db.add(db_scheme)
        try:
            self.db.commit()
        except:
            self.db.rollback()
            raise
        self.db.refresh(db_scheme)

        return db_scheme

    def get_by_id(self, scheme_id: int) -> Scheme | None:
        return (
            self.db.query(Scheme)
            .filter(Scheme.id == scheme_id)
            .first()
        )

    def get_all(self) -> list[Scheme]:
        return (
            self.db.query(Scheme)
            .order_by(Scheme.scheme_name)
            .all()
        )

    def update(
        self,
        db_scheme: Scheme,
        scheme: SchemeUpdate,
    ) -> Scheme:
        update_data = scheme.model_dump(exclude_unset=True)

        for field, value in update_data.items():
            setattr(db_scheme, field, value)

        try:
            self.db.commit()
        except:
            self.db.rollback()
            raise
        self.db.refresh(db_scheme)
        return db_scheme

    def delete(self, db_scheme: Scheme) -> None:
        self.db.delete(db_scheme)
        try:
            self.db.commit()
        except:
            self.db.rollback()
            raise