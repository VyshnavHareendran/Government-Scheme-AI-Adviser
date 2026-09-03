from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.permissions import require_admin
from app.database.dependencies import get_db
from app.models.user import User
from app.models.scheme import Scheme
from app.models.citizen_profile import CitizenProfile
from app.models.eligibility_rule import EligibilityRule
from app.services.ai_recommendation_service import AIRecommendationService

router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
)


@router.get("/dashboard")
def admin_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    citizen_count = (
        db.query(User)
        .filter(User.role == "citizen")
        .count()
    )

    employee_count = (
        db.query(User)
        .filter(User.role == "employee")
        .count()
    )

    admin_count = (
        db.query(User)
        .filter(User.role == "admin")
        .count()
    )

    active_scheme_count = (
        db.query(Scheme)
        .filter(Scheme.is_active.is_(True))
        .count()
    )

    eligibility_rule_count = (
        db.query(EligibilityRule)
        .count()
    )

    citizen_profile_count = (
        db.query(CitizenProfile)
        .count()
    )

    return {
        "admin": {
            "id": current_user.id,
            "full_name": current_user.full_name,
            "email": current_user.email,
        },
        "statistics": {
            "citizens": citizen_count,
            "employees": employee_count,
            "admins": admin_count,
            "active_schemes": active_scheme_count,
            "eligibility_rules": eligibility_rule_count,
            "citizen_profiles": citizen_profile_count,
        },
    }

@router.get("/ai-recommendations")
def admin_ai_recommendations(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    citizens = (
        db.query(User)
        .join(
            CitizenProfile,
            CitizenProfile.user_id == User.id,
        )
        .filter(
            User.role == "citizen",
            User.is_active.is_(True),
        )
        .all()
    )

    total_recommendations = 0
    confidence_total = 0.0
    confidence_count = 0

    scheme_statistics = {}

    for citizen in citizens:
        try:
            recommendations = (
                AIRecommendationService.get_recommendations(
                    db=db,
                    user_id=citizen.id,
                )
            )
        except ValueError:
            continue

        total_recommendations += len(recommendations)

        for recommendation in recommendations:
            confidence = float(
                recommendation.get(
                    "ai_confidence",
                    0,
                )
            )

            confidence_total += confidence
            confidence_count += 1

            scheme_id = recommendation["id"]

            if scheme_id not in scheme_statistics:
                scheme_statistics[scheme_id] = {
                    "scheme_id": scheme_id,
                    "scheme_name": recommendation[
                        "scheme_name"
                    ],
                    "category": recommendation[
                        "category"
                    ],
                    "recommendation_count": 0,
                    "confidence_total": 0.0,
                }

            scheme_statistics[scheme_id][
                "recommendation_count"
            ] += 1

            scheme_statistics[scheme_id][
                "confidence_total"
            ] += confidence

    average_ai_confidence = (
        round(
            confidence_total / confidence_count,
            2,
        )
        if confidence_count
        else 0.0
    )

    top_schemes = []

    for item in scheme_statistics.values():
        count = item["recommendation_count"]

        average_confidence = (
            round(
                item["confidence_total"] / count,
                2,
            )
            if count
            else 0.0
        )

        top_schemes.append(
            {
                "scheme_id": item["scheme_id"],
                "scheme_name": item["scheme_name"],
                "category": item["category"],
                "recommendation_count": count,
                "average_ai_confidence": (
                    average_confidence
                ),
            }
        )

    top_schemes.sort(
        key=lambda item: (
            item["recommendation_count"],
            item["average_ai_confidence"],
        ),
        reverse=True,
    )

    return {
        "statistics": {
            "citizens_evaluated": len(citizens),
            "total_recommendations": (
                total_recommendations
            ),
            "average_ai_confidence": (
                average_ai_confidence
            ),
            "schemes_recommended": len(
                scheme_statistics
            ),
        },
        "top_schemes": top_schemes,
    }

@router.get("/reports")
def admin_reports(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    citizen_count = (
        db.query(User)
        .filter(User.role == "citizen")
        .count()
    )

    employee_count = (
        db.query(User)
        .filter(User.role == "employee")
        .count()
    )

    admin_count = (
        db.query(User)
        .filter(User.role == "admin")
        .count()
    )

    active_scheme_count = (
        db.query(Scheme)
        .filter(Scheme.is_active.is_(True))
        .count()
    )

    eligibility_rule_count = (
        db.query(EligibilityRule)
        .count()
    )

    citizen_profile_count = (
        db.query(CitizenProfile)
        .count()
    )

    ai_statistics = {
        "citizens_evaluated": 0,
        "total_recommendations": 0,
        "average_ai_confidence": 0.0,
        "schemes_recommended": 0,
    }

    top_schemes = []

    citizens = (
        db.query(User)
        .join(
            CitizenProfile,
            CitizenProfile.user_id == User.id,
        )
        .filter(
            User.role == "citizen",
            User.is_active.is_(True),
        )
        .all()
    )

    total_recommendations = 0
    confidence_total = 0.0
    confidence_count = 0
    scheme_statistics = {}

    for citizen in citizens:
        try:
            recommendations = (
                AIRecommendationService.get_recommendations(
                    db=db,
                    user_id=citizen.id,
                )
            )
        except ValueError:
            continue

        total_recommendations += len(recommendations)

        for recommendation in recommendations:
            confidence = float(
                recommendation.get(
                    "ai_confidence",
                    0,
                )
            )

            confidence_total += confidence
            confidence_count += 1

            scheme_id = recommendation["id"]

            if scheme_id not in scheme_statistics:
                scheme_statistics[scheme_id] = {
                    "scheme_id": scheme_id,
                    "scheme_name": recommendation[
                        "scheme_name"
                    ],
                    "category": recommendation[
                        "category"
                    ],
                    "recommendation_count": 0,
                    "confidence_total": 0.0,
                }

            scheme_statistics[scheme_id][
                "recommendation_count"
            ] += 1

            scheme_statistics[scheme_id][
                "confidence_total"
            ] += confidence

    average_ai_confidence = (
        round(
            confidence_total / confidence_count,
            2,
        )
        if confidence_count
        else 0.0
    )

    for item in scheme_statistics.values():
        count = item["recommendation_count"]

        average_confidence = (
            round(
                item["confidence_total"] / count,
                2,
            )
            if count
            else 0.0
        )

        top_schemes.append(
            {
                "scheme_id": item["scheme_id"],
                "scheme_name": item["scheme_name"],
                "category": item["category"],
                "recommendation_count": count,
                "average_ai_confidence": (
                    average_confidence
                ),
            }
        )

    top_schemes.sort(
        key=lambda item: (
            item["recommendation_count"],
            item["average_ai_confidence"],
        ),
        reverse=True,
    )

    ai_statistics = {
        "citizens_evaluated": len(citizens),
        "total_recommendations": total_recommendations,
        "average_ai_confidence": average_ai_confidence,
        "schemes_recommended": len(scheme_statistics),
    }

    return {
        "platform": {
            "citizens": citizen_count,
            "employees": employee_count,
            "administrators": admin_count,
            "citizen_profiles": citizen_profile_count,
            "active_schemes": active_scheme_count,
            "eligibility_rules": eligibility_rule_count,
        },
        "ai_recommendations": ai_statistics,
        "top_schemes": top_schemes[:10],
    }