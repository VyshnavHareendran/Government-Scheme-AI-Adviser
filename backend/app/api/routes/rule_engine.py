from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.dependencies import get_db, get_current_user
from app.models.user import User
from app.services.rule_engine_service import RuleEngineService

router = APIRouter(
    prefix="/rule-engine",
    tags=["Rule Engine"],
)


@router.get("/me")
def get_my_eligible_schemes(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        schemes = RuleEngineService.get_eligible_schemes(
            db=db,
            user_id=current_user.id,
        )

        return {
            "eligible_count": len(schemes),
            "eligible_schemes": [
                {
                    "id": scheme.id,
                    "scheme_name": scheme.scheme_name,
                    "category": scheme.category,
                    "department": scheme.department,
                    "description": scheme.description,
                    "official_url": scheme.official_url,
                }
                for scheme in schemes
            ],
        }

    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))