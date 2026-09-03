"""
Prediction Service V2

Uses the trained CatBoost V2 model
to predict eligibility.
"""

import pandas as pd

from ml.inference.model_loader_v2 import ModelLoaderV2


class PredictionServiceV2:

    @staticmethod
    def predict(features: dict):

        model = ModelLoaderV2.load()

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