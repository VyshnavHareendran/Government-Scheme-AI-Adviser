from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.dependencies import get_db, get_current_user
from app.models.user import User
from app.services.ai_recommendation_service import AIRecommendationService

router = APIRouter(
    prefix="/recommendations",
    tags=["AI Recommendation"],
)


@router.get("/me")
def get_my_recommendations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        recommendations = AIRecommendationService.get_recommendations(
            db=db,
            user_id=current_user.id,
        )

        return {
            "recommendation_count": len(recommendations),
            "recommendations": recommendations,
        }

    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e),
        )