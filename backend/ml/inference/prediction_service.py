"""
Prediction Service

Uses the trained CatBoost model
to predict eligibility.
"""

import pandas as pd

from ml.inference.model_loader import ModelLoader


class PredictionService:

    @staticmethod
    def predict(features: dict):

        model = ModelLoader.load()

        X = pd.DataFrame([features])

        prediction = model.predict(X)[0]

        probability = model.predict_proba(X)[0][1]

        return {
            "eligible": bool(prediction),
            "confidence": float(
                round(
                    probability * 100,
                    2,
                )
            ),
        }