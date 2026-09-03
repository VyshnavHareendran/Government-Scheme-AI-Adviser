from app.database.session import SessionLocal
from app.models.scheme import Scheme


SCHEMES = [
    {
        "scheme_name": "Post Matric Scholarship",
        "category": "Education",
        "department": "Government Scholarship",
        "description": (
            "Financial assistance for eligible students pursuing "
            "post-matriculation education."
        ),
        "official_url": "https://scholarships.gov.in/",
        "income_limit": 250000,
        "minimum_age": 16,
        "maximum_age": 120,
        "requires_land": False,
        "requires_bpl": False,
        "disability_priority": False,
        "target_occupations": ["Student"],
        "preferred_employment": ["Student"],
        "preferred_education": [
            "Higher Secondary",
            "Graduate",
            "Post Graduate",
        ],
    },
    {
        "scheme_name": "Ayushman Bharat",
        "category": "Healthcare",
        "department": "National Health Authority",
        "description": (
            "Health coverage support for eligible beneficiaries "
            "under the Ayushman Bharat health protection framework."
        ),
        "official_url": "https://pmjay.gov.in/",
        "income_limit": 300000,
        "minimum_age": 0,
        "maximum_age": 120,
        "requires_land": False,
        "requires_bpl": True,
        "disability_priority": True,
        "target_occupations": [],
        "preferred_employment": [],
        "preferred_education": [],
    },
    {
        "scheme_name": "PM Awas Yojana",
        "category": "Housing",
        "department": "Ministry of Housing and Urban Affairs",
        "description": (
            "Housing assistance for eligible families under "
            "the Pradhan Mantri Awas Yojana."
        ),
        "official_url": "https://pmaymis.gov.in/",
        "income_limit": 300000,
        "minimum_age": 18,
        "maximum_age": 120,
        "requires_land": False,
        "requires_bpl": True,
        "disability_priority": False,
        "target_occupations": [],
        "preferred_employment": [],
        "preferred_education": [],
    },
    {
        "scheme_name": "Skill India",
        "category": "Employment",
        "department": (
            "Ministry of Skill Development and Entrepreneurship"
        ),
        "description": (
            "Skill development and employment-oriented training "
            "support for eligible individuals."
        ),
        "official_url": "https://www.skillindiadigital.gov.in/",
        "income_limit": 500000,
        "minimum_age": 18,
        "maximum_age": 120,
        "requires_land": False,
        "requires_bpl": False,
        "disability_priority": False,
        "target_occupations": [
            "Student",
            "Unemployed",
        ],
        "preferred_employment": [
            "Student",
            "Unemployed",
        ],
        "preferred_education": [
            "Secondary",
            "Higher Secondary",
            "Graduate",
        ],
    },
]


def main():

    db = SessionLocal()

    try:
        created = 0
        updated = 0

        for data in SCHEMES:

            scheme = (
                db.query(Scheme)
                .filter(
                    Scheme.scheme_name
                    == data["scheme_name"]
                )
                .first()
            )

            if scheme:
                print(
                    f"Found existing scheme: "
                    f"{scheme.scheme_name}"
                )

                for field, value in data.items():
                    if field != "scheme_name":
                        setattr(
                            scheme,
                            field,
                            value,
                        )

                updated += 1

            else:
                scheme = Scheme(**data)

                db.add(scheme)
                created += 1

                print(
                    f"Created scheme: "
                    f"{data['scheme_name']}"
                )

        db.commit()

        print()
        print("===================================")
        print("SCHEMES V2 SEED COMPLETED")
        print("===================================")
        print(f"Created : {created}")
        print(f"Updated : {updated}")

    except Exception:
        db.rollback()
        raise

    finally:
        db.close()


if __name__ == "__main__":
    main()