"""
Synthetic Citizen Generator

Creates validated CitizenFeatures objects for training.
"""

import random

from ml.config.constants import (
    CATEGORIES,
    GENDERS,
    STATES,
)
from ml.data.schemas.feature_schema import CitizenFeatures


class CitizenGenerator:
    """Generates synthetic citizen profiles."""

    def generate(self) -> CitizenFeatures:
        profile = random.choices(
            population=[
                self._student,
                self._farmer,
                self._government_employee,
                self._private_employee,
                self._business_owner,
                self._homemaker,
                self._retired,
                self._unemployed,
            ],
            weights=[
                15,  # Student
                18,  # Farmer
                10,  # Government Employee
                22,  # Private Employee
                10,  # Business Owner
                10,  # Homemaker
                5,   # Retired
                10,  # Unemployed
            ],
            k=1,
        )[0]

        return profile()

    def _create_citizen(
        self,
        *,
        age,
        annual_income,
        occupation,
        employment_status,
        education_level,
        family_size,
        land_holding,
        bpl_card,
    ):
        return CitizenFeatures(
            age=age,
            gender=random.choice(GENDERS),
            state=random.choice(STATES),
            district="Unknown",
            category=random.choice(CATEGORIES),
            annual_income=annual_income,
            occupation=occupation,
            employment_status=employment_status,
            education_level=education_level,
            family_size=family_size,
            land_holding=land_holding,
            bpl_card=bpl_card,
            disability_status=random.choice([True, False]),
        )

    def _student(self) -> CitizenFeatures:

        income = round(
            random.choices(
                population=[
                    random.uniform(0, 50000),
                    random.uniform(50000, 100000),
                    random.uniform(100000, 150000),
                ],
                weights=[50, 35, 15],
                k=1,
            )[0],
            2,
        )

        education = random.choices(
            population=[
                "Higher Secondary",
                "Diploma",
                "Graduate",
            ],
            weights=[
                50,
                20,
                30,
            ],
            k=1,
        )[0]

        return self._create_citizen(
            age=random.randint(18, 24),
            annual_income=income,
            occupation="Student",
            employment_status=random.choices(
                ["Student", "Unemployed"],
                weights=[85, 15],
                k=1,
            )[0],
            education_level=education,
            family_size=random.randint(3, 6),
            land_holding=0.0,
            bpl_card=random.choices(
                [True, False],
                weights=[40, 60],
                k=1,
            )[0],
        )

    def _farmer(self) -> CitizenFeatures:

        income = round(
            random.choices(
                population=[
                    random.uniform(50000, 150000),
                    random.uniform(150000, 250000),
                    random.uniform(250000, 500000),
                ],
                weights=[
                    60,
                    25,
                    15,
                ],
                k=1,
            )[0],
            2,
        )

        education = random.choices(
            population=[
                "Primary",
                "Secondary",
                "Higher Secondary",
            ],
            weights=[
                40,
                40,
                20,
            ],
            k=1,
        )[0]

        return self._create_citizen(
            age=random.randint(25, 65),
            annual_income=income,
            occupation="Farmer",
            employment_status="Self-Employed",
            education_level=education,
            family_size=random.randint(4, 7),
            land_holding=round(random.uniform(1, 8), 2),
            bpl_card=random.choices(
                [True, False],
                weights=[45, 55],
                k=1,
            )[0],
        )
    
    def _government_employee(self) -> CitizenFeatures:
        return self._create_citizen(
            age=random.randint(22, 60),
            annual_income=round(random.uniform(300000, 1200000), 2),
            occupation="Government Employee",
            employment_status="Employed",
            education_level=random.choice(
                [
                    "Graduate",
                    "Post Graduate",
                ]
            ),
            family_size=random.randint(2, 6),
            land_holding=0.0,
            bpl_card=False,
        )

    def _private_employee(self) -> CitizenFeatures:
        return self._create_citizen(
            age=random.randint(21, 60),
            annual_income=round(random.uniform(250000, 1500000), 2),
            occupation="Private Employee",
            employment_status="Employed",
            education_level=random.choice(
                [
                    "Diploma",
                    "Graduate",
                    "Post Graduate",
                ]
            ),
            family_size=random.randint(2, 6),
            land_holding=0.0,
            bpl_card=False,
        )

    def _business_owner(self) -> CitizenFeatures:
        return self._create_citizen(
            age=random.randint(25, 65),
            annual_income=round(random.uniform(400000, 2500000), 2),
            occupation="Business",
            employment_status="Self-Employed",
            education_level=random.choice(
                [
                    "Higher Secondary",
                    "Graduate",
                    "Post Graduate",
                ]
            ),
            family_size=random.randint(2, 7),
            land_holding=round(random.uniform(0, 5), 2),
            bpl_card=False,
        )

    def _homemaker(self) -> CitizenFeatures:
        return self._create_citizen(
            age=random.randint(22, 58),
            annual_income=0.0,
            occupation="Homemaker",
            employment_status="Unemployed",
            education_level=random.choice(
                [
                    "Primary",
                    "Secondary",
                    "Higher Secondary",
                    "Graduate",
                ]
            ),
            family_size=random.randint(3, 8),
            land_holding=round(random.uniform(0, 3), 2),
            bpl_card=random.choice([True, False]),
        )

    def _retired(self) -> CitizenFeatures:
        return self._create_citizen(
            age=random.randint(60, 80),
            annual_income=round(random.uniform(120000, 600000), 2),
            occupation="Retired",
            employment_status="Retired",
            education_level=random.choice(
                [
                    "Secondary",
                    "Graduate",
                    "Post Graduate",
                ]
            ),
            family_size=random.randint(2, 6),
            land_holding=round(random.uniform(0, 5), 2),
            bpl_card=False,
        )

    def _unemployed(self) -> CitizenFeatures:
        return self._create_citizen(
            age=random.randint(18, 55),
            annual_income=round(random.uniform(0, 100000), 2),
            occupation="Unemployed",
            employment_status="Unemployed",
            education_level=random.choice(
                [
                    "Primary",
                    "Secondary",
                    "Higher Secondary",
                    "Graduate",
                ]
            ),
            family_size=random.randint(2, 7),
            land_holding=0.0,
            bpl_card=random.choice([True, False]),
        )