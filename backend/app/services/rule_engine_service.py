from datetime import date

from sqlalchemy.orm import Session

from app.models.scheme import Scheme
from app.repositories.rule_engine_repository import RuleEngineRepository
from app.core.rule_evaluator import RuleEvaluator

class RuleEngineService:

    @staticmethod
    def get_eligible_schemes(
        db: Session,
        user_id: int,
    ) -> list[Scheme]:

        profile = RuleEngineRepository.get_citizen_profile(
            db,
            user_id,
        )

        if not profile:
            raise ValueError("Citizen profile not found.")

        eligible_schemes = []

        schemes = RuleEngineRepository.get_active_schemes(db)

        for scheme in schemes:

            rules = RuleEngineRepository.get_scheme_rules(
                db,
                scheme.id,
            )

            if not rules:
                continue

            eligible = True

            for rule in rules:

                if rule.field_name == "age":

                    today = date.today()

                    citizen_value = (
                        today.year
                        - profile.date_of_birth.year
                        - (
                            (today.month, today.day)
                            < (
                                profile.date_of_birth.month,
                                profile.date_of_birth.day,
                            )
                        )
                    )

                else:

                    citizen_value = getattr(
                        profile,
                        rule.field_name,
                        None,
                    )

                    if hasattr(citizen_value, "value"):
                        citizen_value = citizen_value.value

                if citizen_value is None:
                    eligible = False
                    break

                if not RuleEvaluator.evaluate(
                    citizen_value,
                    rule.operator,
                    rule.value,
                ):
                    eligible = False
                    break

            if eligible:
                eligible_schemes.append(scheme)

        return eligible_schemes

