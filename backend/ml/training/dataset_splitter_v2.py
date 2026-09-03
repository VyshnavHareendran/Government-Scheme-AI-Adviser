"""
Dataset Splitter V2

Splits the V2 dataset into:

- Training
- Validation
- Testing
"""

from sklearn.model_selection import train_test_split


class DatasetSplitterV2:

    @staticmethod
    def split(
        X,
        y,
        random_state=42,
    ):

        X_train, X_temp, y_train, y_temp = train_test_split(
            X,
            y,
            test_size=0.30,
            random_state=random_state,
            stratify=y,
        )

        X_validation, X_test, y_validation, y_test = train_test_split(
            X_temp,
            y_temp,
            test_size=0.50,
            random_state=random_state,
            stratify=y_temp,
        )

        return (
            X_train,
            X_validation,
            X_test,
            y_train,
            y_validation,
            y_test,
        )