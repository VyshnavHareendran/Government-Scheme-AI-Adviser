"""
Model Loader

Loads the trained CatBoost model.
"""

from pathlib import Path

from catboost import CatBoostClassifier


class ModelLoader:

    _model = None

    @classmethod
    def load(cls):

        if cls._model is None:

            model_path = Path(
                "ml/models/scheme_recommender_v1.cbm"
            )

            model = CatBoostClassifier()

            model.load_model(model_path)

            cls._model = model

        return cls._model