from ml.analysis.dataset_analyzer import DatasetAnalyzer


def main():

    DatasetAnalyzer.analyze(
        "datasets/training_dataset.csv"
    )


if __name__ == "__main__":
    main()