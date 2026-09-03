"""
Feature Importance V2

Displays the importance of each feature
used by the CatBoost V2 model.
"""


class FeatureImportanceV2:

    @staticmethod
    def show(model, X_train):

        importance = model.get_feature_importance()

        feature_names = X_train.columns

        feature_scores = sorted(
            zip(feature_names, importance),
            key=lambda x: x[1],
            reverse=True,
        )

        print()
        print("=" * 60)
        print("FEATURE IMPORTANCE V2")
        print("=" * 60)
        print()

        for feature, score in feature_scores:

            print(
                f"{feature:<30} {score:.2f}"
            )