"""
Feature Engineering V2

Converts the V2 dataset into
CatBoost-ready features.
"""

import pandas as pd


class FeatureEngineeringV2:

    @staticmethod
    def prepare(rows):

        dataframe = pd.DataFrame(rows)

        # -----------------------------
        # Numeric Columns
        # -----------------------------
        numeric_columns = [
            "age",
            "annual_income",
            "family_size",
            "land_holding",
            "income_limit",
            "minimum_age",
            "maximum_age",
        ]

        for column in numeric_columns:
            dataframe[column] = pd.to_numeric(
                dataframe[column]
            )

        # -----------------------------
        # Boolean Columns
        # -----------------------------
        boolean_columns = [
            "bpl_card",
            "disability_status",
            "requires_land",
            "requires_bpl",
            "disability_priority",
            "occupation_match",
            "employment_match",
            "education_match",
            "category_match",
            "eligible",
        ]

        for column in boolean_columns:
            dataframe[column] = (
                dataframe[column]
                .astype(str)
                .str.lower()
                .map(
                    {
                        "true": True,
                        "false": False,
                    }
                )
            )

        y = dataframe["eligible"]

        X = dataframe.drop(
            columns=[
                "eligible",
                "citizen_id",
            ]
        )

        return X, y