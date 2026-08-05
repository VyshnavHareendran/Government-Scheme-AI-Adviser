from datetime import date

from app.models.citizen_profile import CitizenProfile


class FeatureBuilder:

    @staticmethod
    def build(
        profile: CitizenProfile,
    ) -> dict:

        today = date.today()

        age = (
            today.year
            - profile.date_of_birth.year
            - (
                (today.month, today.day)
                < (
                    profile.date_of_birth.month,
                    profile.date_of_birth.day,
                )
            )
        )

        return {
            "age": age,
            "state": profile.state,
            "district": profile.district,
            "annual_income": float(profile.annual_income),
            "education_level": profile.education_level,
            "employment_status": profile.employment_status,
            "occupation": profile.occupation,
            "category": profile.category,
            "bpl_card": profile.bpl_card,
            "disability_status": profile.disability_status,
            "family_size": profile.family_size,
            "land_holding": float(profile.land_holding),
        }

    @staticmethod
    def build_ml_features(
        profile: CitizenProfile,
        scheme,
    ) -> dict:

        today = date.today()

        age = (
            today.year
            - profile.date_of_birth.year
            - (
                (today.month, today.day)
                < (
                    profile.date_of_birth.month,
                    profile.date_of_birth.day,
                )
            )
        )

        return {
            "age": age,
            "gender": profile.gender.value,
            "state": profile.state,
            "category": profile.category.value,
            "annual_income": float(profile.annual_income),
            "occupation": profile.occupation,
            "employment_status": profile.employment_status.value,
            "education_level": profile.education_level.value,
            "family_size": profile.family_size,
            "land_holding": float(profile.land_holding),
            "bpl_card": profile.bpl_card,
            "disability_status": profile.disability_status,
            "scheme_name": scheme.scheme_name,
            "scheme_category": scheme.category,
        }