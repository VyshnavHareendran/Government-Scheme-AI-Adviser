"""
Dataset Validator

Performs quality checks before ML training.
"""

import csv


class DatasetValidator:
    """Validates generated training datasets."""

    @staticmethod
    def validate(dataset_path):

        with open(
            dataset_path,
            newline="",
            encoding="utf-8",
        ) as file:

            rows = list(csv.DictReader(file))

        print()
        print("=" * 60)
        print("DATASET VALIDATION REPORT")
        print("=" * 60)

        print(f"Total Rows : {len(rows)}")

        # -----------------------------
        # Missing Values
        # -----------------------------
        print()
        print("Checking missing values...")

        missing_values = {}

        for row in rows:

            for column, value in row.items():

                if value is None or value.strip() == "":

                    missing_values[column] = (
                        missing_values.get(column, 0) + 1
                    )

        if not missing_values:

            print("✓ No missing values found.")

        else:

            print("Missing values detected:")

            for column, count in missing_values.items():

                print(f"{column}: {count}")

        # -----------------------------
        # Duplicate Rows
        # -----------------------------
        print()
        print("Checking duplicate rows...")

        unique_rows = {
            tuple(sorted(row.items()))
            for row in rows
        }

        duplicate_count = len(rows) - len(unique_rows)

        if duplicate_count == 0:

            print("✓ No duplicate rows found.")

        else:

            print(
                f"⚠ Duplicate rows found: {duplicate_count}"
            )

        # -----------------------------
        # Target Distribution
        # -----------------------------
        print()
        print("Checking target distribution...")

        true_count = 0
        false_count = 0

        for row in rows:

            if row["eligible"] == "True":
                true_count += 1
            else:
                false_count += 1

        total = len(rows)

        true_percent = (true_count / total) * 100
        false_percent = (false_count / total) * 100

        print(
            f"Eligible = True  : "
            f"{true_count} ({true_percent:.2f}%)"
        )

        print(
            f"Eligible = False : "
            f"{false_count} ({false_percent:.2f}%)"
        )

        # -----------------------------
        # Scheme-wise Distribution
        # -----------------------------
        print()
        print("Scheme-wise eligibility")

        scheme_stats = {}

        for row in rows:

            scheme = row["scheme_name"]

            if scheme not in scheme_stats:
                scheme_stats[scheme] = {
                    "True": 0,
                    "False": 0,
                }

            scheme_stats[scheme][row["eligible"]] += 1

        print()

        for scheme, stats in scheme_stats.items():

            print(f"{scheme}")

            print(
                f"  True  : {stats['True']}"
            )

            print(
                f"  False : {stats['False']}"
            )

            print()
        

        return rows

        