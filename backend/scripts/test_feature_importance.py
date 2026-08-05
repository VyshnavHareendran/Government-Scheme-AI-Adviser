from ml.training.data_loader import DataLoader
from ml.training.feature_engineering import FeatureEngineering
from ml.training.dataset_splitter import DatasetSplitter
from ml.training.train_model import ModelTrainer
from ml.training.feature_importance import FeatureImportance


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

    print("Training model...")

    model = ModelTrainer.train(
        X_train,
        y_train,
        X_validation,
        y_validation,
    )

    FeatureImportance.show(model)


if __name__ == "__main__":
    main()