from ml.training.data_loader import DataLoader


def main():

    rows = DataLoader.load(
        "datasets/training_dataset.csv"
    )

    print()

    print(f"Rows Loaded : {len(rows)}")

    print()

    print(rows[0])


if __name__ == "__main__":
    main()