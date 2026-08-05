from app.repositories.scheme_repository import SchemeRepository
from app.schemas.scheme import SchemeCreate, SchemeUpdate
from app.models.scheme import Scheme

class SchemeService:
    def __init__(self, repository: SchemeRepository):
        self.repository = repository

    def create_scheme(
        self,
        scheme: SchemeCreate,
    ) -> Scheme:
        return self.repository.create(scheme)

    def get_scheme(
        self,
        scheme_id: int,
    ) -> Scheme | None:
        return self.repository.get_by_id(scheme_id)

    def get_all_schemes(
        self,
    ) -> list[Scheme]:
        return self.repository.get_all()

    def update_scheme(
        self,
        scheme_id: int,
        scheme: SchemeUpdate,
    ) -> Scheme | None:
        db_scheme = self.repository.get_by_id(scheme_id)

        if not db_scheme:
            return None

        return self.repository.update(db_scheme, scheme)

    def delete_scheme(
        self,
        scheme_id: int,
    ) -> bool:
        db_scheme = self.repository.get_by_id(scheme_id)

        if not db_scheme:
            return False

        self.repository.delete(db_scheme)
        return True