from ml.pipelines.dataset_builder import DatasetBuilder


def main():
    builder = DatasetBuilder()

    examples = builder.generate_training_examples()

    print(f"Generated {len(examples)} training examples\n")

    for example in examples:
        print(example)


if __name__ == "__main__":
    main()