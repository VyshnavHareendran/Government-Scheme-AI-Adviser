"""
Target Distribution Analysis
"""


class TargetAnalysis:

    @staticmethod
    def analyze(rows):

        true_count = 0
        false_count = 0

        for row in rows:

            if row["eligible"] == "True":
                true_count += 1
            else:
                false_count += 1

        total = len(rows)

        print()
        print("TARGET DISTRIBUTION")
        print("-------------------")

        print(
            f"Eligible : {true_count} "
            f"({true_count / total * 100:.2f}%)"
        )

        print(
            f"Not Eligible : {false_count} "
            f"({false_count / total * 100:.2f}%)"
        )