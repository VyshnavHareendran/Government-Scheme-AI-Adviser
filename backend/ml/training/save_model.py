"""
Model Saver

Saves the trained CatBoost model.
"""

from pathlib import Path


class ModelSaver:

    @staticmethod
    def save(
        model,
        model_path,
    ):

        Path(model_path).parent.mkdir(
            parents=True,
            exist_ok=True,
        )

        model.save_model(model_path)

        print()

        print("Model saved successfully!")

        print(model_path)