from app.database.session import SessionLocal
from app.models.scheme import Scheme
from app.models.eligibility_rule import EligibilityRule


UPDATED_RULES = {
    "Post Matric Scholarship": [
        ("age", ">=", "16"),
        ("annual_income", "<=", "250000"),
        ("employment_status", "=", "Student"),
        ("education_level", "IN", "Plus Two,UG,PG"),
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
        ("employment_status", "IN", "Student,Unemployed"),
        ("education_level", "IN", "SSLC,Plus Two,Diploma,UG"),
    ],
}


def main():
    db = SessionLocal()

    try:
        updated = 0

        for scheme_name, rules in UPDATED_RULES.items():

            scheme = (
                db.query(Scheme)
                .filter(Scheme.scheme_name == scheme_name)
                .first()
            )

            if not scheme:
                print(f"Scheme not found: {scheme_name}")
                continue

            print()
            print(f"Updating: {scheme_name}")

            # Remove all existing rules for this scheme
            deleted = (
                db.query(EligibilityRule)
                .filter(
                    EligibilityRule.scheme_id == scheme.id
                )
                .delete(synchronize_session=False)
            )

            print(f"  Removed old rules: {deleted}")

            # Add corrected rules
            for field_name, operator, value in rules:

                rule = EligibilityRule(
                    scheme_id=scheme.id,
                    field_name=field_name,
                    operator=operator,
                    value=value,
                )

                db.add(rule)

                print(
                    f"  Added: "
                    f"{field_name} {operator} {value}"
                )

            updated += 1

        db.commit()

        print()
        print("=" * 60)
        print("SCHEME RULES UPDATED")
        print("=" * 60)
        print(f"Schemes updated: {updated}")

    except Exception:
        db.rollback()
        raise

    finally:
        db.close()


if __name__ == "__main__":
    main()