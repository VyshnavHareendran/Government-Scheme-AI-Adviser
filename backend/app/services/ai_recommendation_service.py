from app.repositories.ai_recommendation_repository import (
    AIRecommendationRepository,
)
from app.services.feature_builder import FeatureBuilder
from ml.inference.prediction_service import PredictionService
from app.services.recommendation_scorer import RecommendationScorer


class AIRecommendationService:

    @staticmethod
    def get_recommendations(
        db,
        user_id: int,
    ):

        profile = AIRecommendationRepository.get_citizen_profile(
            db,
            user_id,
        )

        if not profile:
            raise ValueError("Citizen profile not found.")

        eligible_schemes = (
            AIRecommendationRepository.get_eligible_schemes(
                db,
                user_id,
            )
        )

        recommendations = []

        for scheme in eligible_schemes:

            features = FeatureBuilder.build_ml_features(
                profile,
                scheme,
            )

            ai_result = PredictionService.predict(
                features
            )

            score, reasons = (
                RecommendationScorer.calculate_score(
                    FeatureBuilder.build(profile)
                )
            )

            recommendations.append(
                {
                    "id": scheme.id,
                    "scheme_name": scheme.scheme_name,
                    "category": scheme.category,
                    "department": scheme.department,
                    "description": scheme.description,
                    "official_url": scheme.official_url,

                    # Existing recommendation score
                    "score": score,

                    # New AI prediction
                    "ai_confidence": ai_result["confidence"],
                    "eligible": ai_result["eligible"],

                    # Existing explanations
                    "reasons": reasons,
                }
            )

        recommendations.sort(
            key=lambda x: x["score"],
            reverse=True,
        )

        return recommendations