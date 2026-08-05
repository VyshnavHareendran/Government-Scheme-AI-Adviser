"""
Eligibility Engine

Evaluates whether a citizen is eligible
for a given government scheme.
"""


class EligibilityEngine:
    """Evaluates citizen eligibility."""

    def is_eligible(
        self,
        citizen,
        scheme,
    ) -> bool:

        # Age
        if citizen.age < scheme["min_age"]:
            return False

        # Income
        if citizen.annual_income > scheme["income_max"]:
            return False

        # Occupation
        if scheme["target_occupations"]:
            if citizen.occupation not in scheme["target_occupations"]:
                return False

        # Employment
        if scheme["preferred_employment"]:
            if citizen.employment_status not in scheme["preferred_employment"]:
                return False

        # Education
        if scheme["preferred_education"]:
            if citizen.education_level not in scheme["preferred_education"]:
                return False

        # Land
        if scheme["requires_land"]:
            if citizen.land_holding <= 0:
                return False

        # BPL
        if scheme["requires_bpl"]:
            if not citizen.bpl_card:
                return False

        return True