"""
Generate Training Dataset V2

Generates the production-ready
training dataset using scheme
properties instead of scheme names.
"""

from ml.exporters.csv_exporter import CSVExporter
from ml.pipelines.dataset_builder_v2 import DatasetBuilderV2


def main():

    builder = DatasetBuilderV2()

    print("Generating V2 training dataset...")

    dataset = builder.build_training_dataset(
        citizens_count=1000,
    )

    output_file = (
        "datasets/training_dataset_v2.csv"
    )

    CSVExporter.export(
        dataset,
        output_file,
    )

    print()

    print(f"Training rows : {len(dataset)}")

    print(f"Saved to      : {output_file}")


if __name__ == "__main__":
    main()