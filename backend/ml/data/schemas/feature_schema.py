"""
Feature Schema

This module defines the canonical feature representation
used throughout the ML pipeline.

IMPORTANT:
This schema is the contract between:

- Dataset Pipeline
- Feature Store
- Training Pipeline
- Inference Pipeline

Do not change field names without updating all dependent
components.
"""

from dataclasses import dataclass
from .validators import (
    validate_age,
    validate_category,
    validate_education,
    validate_employment,
    validate_family_size,
    validate_gender,
    validate_income,
    validate_land_holding,
    validate_occupation,
    validate_state,
)

@dataclass(frozen=True)
class CitizenFeatures:
    age: int
    gender: str

    state: str
    district: str

    category: str

    annual_income: float

    occupation: str
    employment_status: str

    education_level: str

    family_size: int

    land_holding: float

    bpl_card: bool

    disability_status: bool

    def __post_init__(self):
        validate_age(self.age)
        validate_gender(self.gender)

        validate_state(self.state)
        validate_category(self.category)

        validate_income(self.annual_income)

        validate_occupation(self.occupation)
        validate_employment(self.employment_status)
        validate_education(self.education_level)

        validate_family_size(self.family_size)
        validate_land_holding(self.land_holding)


@dataclass(frozen=True)
class SchemeFeatures:
    scheme_name: str
    scheme_category: str
    department: str


@dataclass(frozen=True)
class RecommendationFeatures:
    citizen: CitizenFeatures
    scheme: SchemeFeatures