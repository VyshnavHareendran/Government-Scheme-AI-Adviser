from sqlalchemy.orm import Session

from app.models.citizen_profile import CitizenProfile
from app.models.scheme import Scheme
from app.repositories.rule_engine_repository import RuleEngineRepository


class AIRecommendationRepository:

    @staticmethod
    def get_citizen_profile(
        db: Session,
        user_id: int,
    ) -> CitizenProfile | None:
        return RuleEngineRepository.get_citizen_profile(
            db,
            user_id,
        )

    @staticmethod
    def get_eligible_schemes(
        db: Session,
        user_id: int,
    ) -> list[Scheme]:
        """
        Returns only schemes already verified
        by the Rule Engine.
        """
        from app.services.rule_engine_service import RuleEngineService

        return RuleEngineService.get_eligible_schemes(
            db=db,
            user_id=user_id,
        )

    @staticmethod
    def get_all_active_schemes(
        db: Session,
    ) -> list[Scheme]:
        """
        Returns all active schemes.

        Used by the AI recommendation engine.
        Does NOT affect the existing
        rule-based recommendation flow.
        """

        return (
            db.query(Scheme)
            .filter(Scheme.is_active == True)
            .all()
        )