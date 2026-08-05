"""
Dataset Analyzer

Provides statistics about the generated
training dataset.
"""

import csv
from ml.analysis.target_analysis import TargetAnalysis

class DatasetAnalyzer:

    @staticmethod
    def analyze(dataset_path):

        with open(
            dataset_path,
            newline="",
            encoding="utf-8",
        ) as file:

            rows = list(csv.DictReader(file))

        print()
        print("=" * 60)
        print("DATASET ANALYSIS")
        print("=" * 60)

        print(f"Rows : {len(rows)}")
        TargetAnalysis.analyze(rows)