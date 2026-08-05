"""
Generate Training Dataset

Temporary script for testing the ML data pipeline.
"""

from ml.pipelines.citizen_generator import CitizenGenerator
from ml.pipelines.dataset_pipeline import DatasetPipeline


def main():
    generator = CitizenGenerator()
    pipeline = DatasetPipeline()

    for _ in range(10):
        citizen = generator.generate()
        pipeline.add(citizen)

    dataset = pipeline.build()

    print(f"Dataset Size: {pipeline.size}")

    print()

    for citizen in dataset:
        print(citizen)


if __name__ == "__main__":
    main()