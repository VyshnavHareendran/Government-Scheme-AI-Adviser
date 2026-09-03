from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session

from app.core.permissions import require_admin
from app.database.dependencies import get_db
from app.models.user import User
from app.repositories.eligibility_rule_repository import (
    EligibilityRuleRepository,
)
from app.schemas.eligibility_rule import (
    EligibilityRuleCreate,
    EligibilityRuleResponse,
    EligibilityRuleUpdate,
)
from app.services.eligibility_rule_service import (
    EligibilityRuleService,
)

router = APIRouter(
    prefix="/eligibility-rules",
    tags=["Eligibility Rules"],
)


def get_eligibility_rule_service(
    db: Session = Depends(get_db),
) -> EligibilityRuleService:
    repository = EligibilityRuleRepository(db)
    return EligibilityRuleService(repository)


@router.post(
    "/",
    response_model=EligibilityRuleResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_rule(
    rule: EligibilityRuleCreate,
    service: EligibilityRuleService = Depends(
        get_eligibility_rule_service
    ),
    current_user=Depends(require_admin),
):
    return service.create_rule(rule)


@router.get(
    "/",
    response_model=list[EligibilityRuleResponse],
)
def get_all_rules(
    service: EligibilityRuleService = Depends(
        get_eligibility_rule_service
    ),
):
    return service.get_all_rules()


@router.put(
    "/{rule_id}",
    response_model=EligibilityRuleResponse,
)
def update_rule(
    rule_id: int,
    rule: EligibilityRuleUpdate,
    service: EligibilityRuleService = Depends(
        get_eligibility_rule_service
    ),
    current_user=Depends(require_admin),
):
    rule = service.get_rule(rule_id)

    if not rule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Eligibility rule not found",
        )

    return rule


@router.put(
    "/{rule_id}",
    response_model=EligibilityRuleResponse,
)
def update_rule(
    rule_id: int,
    rule: EligibilityRuleUpdate,
    service: EligibilityRuleService = Depends(
        get_eligibility_rule_service
    ),
    current_user: User = Depends(require_admin),
):
    updated = service.update_rule(rule_id, rule)

    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Eligibility rule not found",
        )

    return updated


@router.delete(
    "/{rule_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_rule(
    rule_id: int,
    service: EligibilityRuleService = Depends(
        get_eligibility_rule_service,
    ),
    current_user=Depends(require_admin),
):
    deleted = service.delete_rule(rule_id)

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Eligibility rule not found",
        )

    return Response(status_code=status.HTTP_204_NO_CONTENT)