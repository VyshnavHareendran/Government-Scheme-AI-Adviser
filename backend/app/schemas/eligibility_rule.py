from datetime import datetime

from pydantic import BaseModel, ConfigDict


class EligibilityRuleCreate(BaseModel):
    scheme_id: int
    field_name: str
    operator: str
    value: str


class EligibilityRuleUpdate(BaseModel):
    field_name: str | None = None
    operator: str | None = None
    value: str | None = None


class EligibilityRuleResponse(BaseModel):
    id: int
    scheme_id: int
    field_name: str
    operator: str
    value: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)