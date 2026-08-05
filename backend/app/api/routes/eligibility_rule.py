from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
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


@router.get(
    "/{rule_id}",
    response_model=EligibilityRuleResponse,
)
def get_rule(
    rule_id: int,
    service: EligibilityRuleService = Depends(
        get_eligibility_rule_service
    ),
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
):
    deleted = service.delete_rule(rule_id)

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Eligibility rule not found",
        )

    return Response(status_code=status.HTTP_204_NO_CONTENT)