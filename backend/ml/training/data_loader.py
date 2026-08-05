"""
Training Data Loader

Loads the generated training dataset
for model training.
"""

import csv


class DataLoader:
    """Loads the training dataset."""

    @staticmethod
    def load(dataset_path):

        with open(
            dataset_path,
            newline="",
            encoding="utf-8",
        ) as file:

            rows = list(csv.DictReader(file))

        return rows