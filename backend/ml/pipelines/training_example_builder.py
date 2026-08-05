"""
Training Example Builder

Converts a citizen and a scheme into a
single ML training example.
"""


class TrainingExampleBuilder:
    """Creates ML training examples."""

    def build(
        self,
        citizen,
        scheme,
        eligible,
    ):
        return {
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

            "scheme_name": scheme["scheme_name"],
            "scheme_category": scheme["category"],

            "eligible": eligible,
        }