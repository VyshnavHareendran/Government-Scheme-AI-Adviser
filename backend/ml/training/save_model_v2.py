"""
Save Model V2

Saves the trained CatBoost V2 model.
"""


class ModelSaverV2:

    @staticmethod
    def save(
        model,
        output_path,
    ):

        model.save_model(output_path)

        print()

        print("Model saved successfully!")

        print(output_path)