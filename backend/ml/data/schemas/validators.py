"""
Feature Validation Rules

This module validates raw feature values before they enter the
ML pipeline.

All dataset sources (synthetic, CSV, database) must pass through
these validators.
"""

from typing import Any

from ml.config.constants import (
    CATEGORIES,
    EDUCATION_LEVELS,
    EMPLOYMENT_STATUS,
    GENDERS,
    OCCUPATIONS,
    STATES,
)


class ValidationError(ValueError):
    """Raised when feature validation fails."""


def validate_age(age: int) -> int:
    if not isinstance(age, int):
        raise ValidationError("Age must be an integer.")

    if age < 18 or age > 120:
        raise ValidationError("Age must be between 18 and 120.")

    return age


def validate_income(income: float) -> float:
    if income < 0:
        raise ValidationError("Income cannot be negative.")

    return income


def validate_land_holding(area: float) -> float:
    if area < 0:
        raise ValidationError("Land holding cannot be negative.")

    return area


def validate_family_size(size: int) -> int:
    if size < 1:
        raise ValidationError("Family size must be at least 1.")

    return size


def validate_choice(value: Any, allowed_values: list, field_name: str):
    if value not in allowed_values:
        raise ValidationError(
            f"Invalid {field_name}: {value}. "
            f"Allowed values: {allowed_values}"
        )

    return value


def validate_gender(gender: str):
    return validate_choice(gender, GENDERS, "gender")


def validate_state(state: str):
    return validate_choice(state, STATES, "state")


def validate_category(category: str):
    return validate_choice(category, CATEGORIES, "category")


def validate_education(level: str):
    return validate_choice(
        level,
        EDUCATION_LEVELS,
        "education_level",
    )


def validate_occupation(occupation: str):
    return validate_choice(
        occupation,
        OCCUPATIONS,
        "occupation",
    )


def validate_employment(status: str):
    return validate_choice(
        status,
        EMPLOYMENT_STATUS,
        "employment_status",
    )