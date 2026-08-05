from sqlalchemy.orm import Session

from app.models.eligibility_rule import EligibilityRule
from app.schemas.eligibility_rule import (
    EligibilityRuleCreate,
    EligibilityRuleUpdate,
)


class EligibilityRuleRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(
        self,
        rule: EligibilityRuleCreate,
    ) -> EligibilityRule:
        data = rule.model_dump()

        db_rule = EligibilityRule(**data)

        self.db.add(db_rule)
        self.db.commit()
        self.db.refresh(db_rule)

        return db_rule

    def get_by_id(
        self,
        rule_id: int,
    ) -> EligibilityRule | None:
        return (
            self.db.query(EligibilityRule)
            .filter(EligibilityRule.id == rule_id)
            .first()
        )

    def get_all(self) -> list[EligibilityRule]:
        return (
            self.db.query(EligibilityRule)
            .order_by(EligibilityRule.id)
            .all()
        )

    def update(
        self,
        db_rule: EligibilityRule,
        rule: EligibilityRuleUpdate,
    ) -> EligibilityRule:
        update_data = rule.model_dump(exclude_unset=True)

        for field, value in update_data.items():
            setattr(db_rule, field, value)

        self.db.commit()
        self.db.refresh(db_rule)

        return db_rule

    def delete(
        self,
        db_rule: EligibilityRule,
    ) -> None:
        self.db.delete(db_rule)
        self.db.commit()