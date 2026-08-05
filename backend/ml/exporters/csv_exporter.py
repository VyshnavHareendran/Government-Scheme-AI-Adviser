"""
CSV Exporter

Exports datasets using Python's built-in csv module.
"""

import csv
from pathlib import Path


class CSVExporter:
    """Exports datasets to CSV."""

    @staticmethod
    def export(
        dataset,
        output_path,
    ):
        output_path = Path(output_path)

        output_path.parent.mkdir(
            parents=True,
            exist_ok=True,
        )

        if not dataset:
            raise ValueError("Dataset is empty.")

        with open(
            output_path,
            mode="w",
            newline="",
            encoding="utf-8",
        ) as csv_file:

            writer = csv.DictWriter(
                csv_file,
                fieldnames=dataset[0].keys(),
            )

            writer.writeheader()

            writer.writerows(dataset)

        return output_path