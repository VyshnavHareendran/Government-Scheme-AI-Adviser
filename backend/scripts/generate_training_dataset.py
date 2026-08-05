from ml.exporters.csv_exporter import CSVExporter
from ml.pipelines.dataset_builder import DatasetBuilder


def main():

    builder = DatasetBuilder()

    print("Generating training dataset...")

    dataset = builder.build_training_dataset(
        citizens_count=1000,
    )

    output_file = "datasets/training_dataset.csv"

    CSVExporter.export(
        dataset,
        output_file,
    )

    print()

    print(f"Training rows : {len(dataset)}")

    print(f"Saved to      : {output_file}")


if __name__ == "__main__":
    main()