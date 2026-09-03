"""
Model Loader V2

Loads the trained CatBoost V2 model.
"""

from pathlib import Path

from catboost import CatBoostClassifier


class ModelLoaderV2:

    _model = None

    @classmethod
    def load(cls):

        if cls._model is None:

            model_path = Path(
                "ml/models/scheme_recommender_v2.cbm"
            )

            model = CatBoostClassifier()

            model.load_model(model_path)

            cls._model = model

        return cls._model