from sqlalchemy.orm import Session

from app.models.citizen_profile import CitizenProfile
from app.models.eligibility_rule import EligibilityRule
from app.models.scheme import Scheme


class RuleEngineRepository:

    @staticmethod
    def get_citizen_profile(
        db: Session,
        user_id: int,
    ) -> CitizenProfile | None:
        return (
            db.query(CitizenProfile)
            .filter(CitizenProfile.user_id == user_id)
            .first()
        )

    @staticmethod
    def get_active_schemes(
        db: Session,
    ) -> list[Scheme]:
        return (
            db.query(Scheme)
            .filter(Scheme.is_active.is_(True))
            .all()
        )

    @staticmethod
    def get_scheme_rules(
        db: Session,
        scheme_id: int,
    ) -> list[EligibilityRule]:
        return (
            db.query(EligibilityRule)
            .filter(
                EligibilityRule.scheme_id == scheme_id,
            )
            .all()
        )