from datetime import date
from decimal import Decimal

from sqlalchemy.orm import Session

from app.models.scheme import Scheme
from app.repositories.rule_engine_repository import RuleEngineRepository


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

                if citizen_value is None:
                    eligible = False
                    break

                if not RuleEngineService.evaluate_rule(
                    citizen_value,
                    rule.operator,
                    rule.value,
                ):
                    eligible = False
                    break

            if eligible:
                eligible_schemes.append(scheme)

        return eligible_schemes

    @staticmethod
    def evaluate_rule(
        citizen_value,
        operator,
        rule_value,
    ) -> bool:

        if isinstance(citizen_value, Decimal):
            rule_value = Decimal(rule_value)

        elif isinstance(citizen_value, bool):
            rule_value = rule_value.lower() == "true"

        elif isinstance(citizen_value, int):
            rule_value = int(rule_value)

        if operator == "=":
            return citizen_value == rule_value

        elif operator == "!=":
            return citizen_value != rule_value

        elif operator == ">":
            return citizen_value > rule_value

        elif operator == ">=":
            return citizen_value >= rule_value

        elif operator == "<":
            return citizen_value < rule_value

        elif operator == "<=":
            return citizen_value <= rule_value

        return False