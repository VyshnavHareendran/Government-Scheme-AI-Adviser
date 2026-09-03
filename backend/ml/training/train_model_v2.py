"""
Model Trainer V2

Trains the production-ready
CatBoost model using
scheme-property features.
"""

from catboost import CatBoostClassifier, Pool


class ModelTrainerV2:

    @staticmethod
    def train(
        X_train,
        y_train,
        X_validation,
        y_validation,
    ):

        categorical_features = [
            "gender",
            "state",
            "category",
            "occupation",
            "employment_status",
            "education_level",
        ]

        model = CatBoostClassifier(
            iterations=300,
            learning_rate=0.05,
            depth=6,
            loss_function="Logloss",
            eval_metric="F1",
            verbose=50,
            random_seed=42,
        )

        train_pool = Pool(
            data=X_train,
            label=y_train,
            cat_features=categorical_features,
        )

        validation_pool = Pool(
            data=X_validation,
            label=y_validation,
            cat_features=categorical_features,
        )

        model.fit(
            train_pool,
            eval_set=validation_pool,
            use_best_model=True,
        )

        return model