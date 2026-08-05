from ml.training.data_loader import DataLoader
from ml.training.feature_engineering import FeatureEngineering
from ml.training.dataset_splitter import DatasetSplitter


def main():

    rows = DataLoader.load(
        "datasets/training_dataset.csv"
    )

    X, y = FeatureEngineering.prepare(rows)

    (
        X_train,
        X_validation,
        X_test,
        y_train,
        y_validation,
        y_test,
    ) = DatasetSplitter.split(X, y)

    print()

    print(f"Training Samples   : {len(X_train)}")

    print(f"Validation Samples : {len(X_validation)}")

    print(f"Testing Samples    : {len(X_test)}")


if __name__ == "__main__":
    main()