from app.repositories.eligibility_rule_repository import (
    EligibilityRuleRepository,
)
from app.schemas.eligibility_rule import (
    EligibilityRuleCreate,
    EligibilityRuleUpdate,
)


class EligibilityRuleService:
    def __init__(
        self,
        repository: EligibilityRuleRepository,
    ):
        self.repository = repository

    def create_rule(
        self,
        rule: EligibilityRuleCreate,
    ):
        return self.repository.create(rule)

    def get_rule(
        self,
        rule_id: int,
    ):
        return self.repository.get_by_id(rule_id)

    def get_all_rules(self):
        return self.repository.get_all()

    def update_rule(
        self,
        rule_id: int,
        rule: EligibilityRuleUpdate,
    ):
        db_rule = self.repository.get_by_id(rule_id)

        if not db_rule:
            return None

        return self.repository.update(db_rule, rule)

    def delete_rule(
        self,
        rule_id: int,
    ):
        db_rule = self.repository.get_by_id(rule_id)

        if not db_rule:
            return False

        self.repository.delete(db_rule)
        return True