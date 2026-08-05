from ml.training.data_loader import DataLoader
from ml.training.feature_engineering import (
    FeatureEngineering,
)


def main():

    rows = DataLoader.load(
        "datasets/training_dataset.csv"
    )

    X, y = FeatureEngineering.prepare(rows)

    print()

    print(f"Samples : {len(X)}")

    print()

    print("Features")

    print(X.iloc[0])

    print()

    print("Target")

    print(y[0])


if __name__ == "__main__":
    main()