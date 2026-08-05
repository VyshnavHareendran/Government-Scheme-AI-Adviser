"""
Feature Engineering

Converts raw CSV rows into
training-ready features.
"""

import pandas as pd

class FeatureEngineering:

    @staticmethod
    def prepare(rows):

        X = []
        y = []

        for row in rows:

            features = {

                "age": int(row["age"]),

                "gender": row["gender"],

                "state": row["state"],

                "category": row["category"],

                "annual_income": float(
                    row["annual_income"]
                ),

                "occupation": row["occupation"],

                "employment_status": row[
                    "employment_status"
                ],

                "education_level": row[
                    "education_level"
                ],

                "family_size": int(
                    row["family_size"]
                ),

                "land_holding": float(
                    row["land_holding"]
                ),

                "bpl_card": (
                    row["bpl_card"] == "True"
                ),

                "disability_status": (
                    row["disability_status"] == "True"
                ),

                "scheme_name": row[
                    "scheme_name"
                ],

                "scheme_category": row[
                    "scheme_category"
                ],
            }

            X.append(features)

            y.append(
                row["eligible"] == "True"
            )

        X = pd.DataFrame(X)

        return X, y