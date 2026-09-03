"""
Training Example Builder V2

Creates production-ready ML features.

Instead of learning scheme names,
the model learns scheme properties.
"""


class TrainingExampleBuilderV2:

    def build(
        self,
        citizen,
        scheme,
        eligible,
    ):

        return {

            # -----------------------------
            # Citizen Features
            # -----------------------------
            "age": citizen.age,
            "gender": citizen.gender,
            "state": citizen.state,
            "category": citizen.category,
            "annual_income": citizen.annual_income,
            "occupation": citizen.occupation,
            "employment_status": citizen.employment_status,
            "education_level": citizen.education_level,
            "family_size": citizen.family_size,
            "land_holding": citizen.land_holding,
            "bpl_card": citizen.bpl_card,
            "disability_status": citizen.disability_status,

            # -----------------------------
            # Scheme Features
            # -----------------------------
            "income_limit": scheme["income_max"],

            "minimum_age": scheme["min_age"],

            "maximum_age": scheme["max_age"],

            "requires_land": scheme["requires_land"],

            "requires_bpl": scheme["requires_bpl"],

            "disability_priority": scheme[
                "disability_priority"
            ],

            # -----------------------------
            # Matching Features
            # -----------------------------
            "occupation_match":
                citizen.occupation
                in scheme["target_occupations"],

            "employment_match":
                citizen.employment_status
                in scheme["preferred_employment"],

            "education_match":
                citizen.education_level
                in scheme["preferred_education"],

            "category_match":
                (
                    not scheme["target_categories"]
                    or citizen.category
                    in scheme["target_categories"]
                ),

            # -----------------------------
            # Target
            # -----------------------------
            "eligible": eligible,
        }