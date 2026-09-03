from app.database.session import SessionLocal
from app.models.eligibility_rule import EligibilityRule
from app.models.scheme import Scheme


SCHEME_RULES = {
    "Post Matric Scholarship": [
        ("age", ">=", "16"),
        ("annual_income", "<=", "250000"),
        ("employment_status", "=", "Student"),
        (
            "education_level",
            "IN",
            "Plus Two,UG,PG",
        ),
    ],

    "Ayushman Bharat": [
        ("annual_income", "<=", "300000"),
        ("bpl_card", "=", "true"),
    ],

    "PM Awas Yojana": [
        ("age", ">=", "18"),
        ("annual_income", "<=", "300000"),
        ("bpl_card", "=", "true"),
    ],

    "Skill India": [
        ("age", ">=", "18"),
        ("annual_income", "<=", "500000"),
        (
            "employment_status",
            "IN",
            "Student,Unemployed",
        ),
        (
            "education_level",
            "IN",
            "SSLC,Plus Two,Diploma,UG",
        ),
    ],
}


def main():

    db = SessionLocal()

    try:

        added = 0
        skipped = 0

        for scheme_name, rules in SCHEME_RULES.items():

            scheme = (
                db.query(Scheme)
                .filter(
                    Scheme.scheme_name == scheme_name
                )
                .first()
            )

            if not scheme:
                print(
                    f"Scheme not found: {scheme_name}"
                )
                continue

            print()
            print(
                f"Processing: {scheme_name}"
            )

            for field_name, operator, value in rules:

                existing = (
                    db.query(EligibilityRule)
                    .filter(
                        EligibilityRule.scheme_id
                        == scheme.id,
                        EligibilityRule.field_name
                        == field_name,
                        EligibilityRule.operator
                        == operator,
                        EligibilityRule.value
                        == value,
                    )
                    .first()
                )

                if existing:

                    print(
                        f"  SKIP: {field_name} "
                        f"{operator} {value}"
                    )

                    skipped += 1
                    continue

                rule = EligibilityRule(
                    scheme_id=scheme.id,
                    field_name=field_name,
                    operator=operator,
                    value=value,
                )

                db.add(rule)

                print(
                    f"  ADD : {field_name} "
                    f"{operator} {value}"
                )

                added += 1

        db.commit()

        print()
        print("=" * 60)
        print("SCHEME RULE SEEDING COMPLETED")
        print("=" * 60)
        print(f"Added  : {added}")
        print(f"Skipped: {skipped}")

    except Exception:

        db.rollback()
        raise

    finally:

        db.close()


if __name__ == "__main__":
    main()