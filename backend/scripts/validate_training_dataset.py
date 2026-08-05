from ml.validation.dataset_validator import DatasetValidator


def main():

    DatasetValidator.validate(
        "datasets/training_dataset.csv"
    )


if __name__ == "__main__":
    main()