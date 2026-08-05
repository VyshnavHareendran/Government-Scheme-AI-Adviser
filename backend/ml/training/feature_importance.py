"""
Feature Importance

Displays feature importance
from the trained CatBoost model.
"""


class FeatureImportance:

    @staticmethod
    def show(model):

        print()
        print("=" * 60)
        print("FEATURE IMPORTANCE")
        print("=" * 60)
        print()

        importance = model.get_feature_importance()

        feature_names = model.feature_names_

        results = sorted(
            zip(feature_names, importance),
            key=lambda item: item[1],
            reverse=True,
        )

        for feature, score in results:

            print(f"{feature:<25} {score:>8.2f}")