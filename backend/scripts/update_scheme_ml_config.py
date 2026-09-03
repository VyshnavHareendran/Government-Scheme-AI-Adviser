from app.database.session import SessionLocal
from app.models.scheme import Scheme


def main():

    db = SessionLocal()

    try:

        scheme = (
            db.query(Scheme)
            .filter(
                Scheme.scheme_name == "PM Kisan"
            )
            .first()
        )

        if not scheme:
            print("PM Kisan not found.")
            return

        scheme.income_limit = 200000
        scheme.minimum_age = 18
        scheme.maximum_age = 120

        scheme.requires_land = True
        scheme.requires_bpl = False
        scheme.disability_priority = False

        scheme.target_occupations = [
            "Farmer"
        ]

        scheme.preferred_employment = [
            "Self-Employed"
        ]

        scheme.preferred_education = []

        db.commit()
        db.refresh(scheme)

        print("PM Kisan ML configuration updated successfully!")

        print()
        print("Scheme:", scheme.scheme_name)
        print("Income limit:", scheme.income_limit)
        print("Minimum age:", scheme.minimum_age)
        print("Maximum age:", scheme.maximum_age)
        print("Requires land:", scheme.requires_land)
        print("Requires BPL:", scheme.requires_bpl)
        print(
            "Disability priority:",
            scheme.disability_priority,
        )
        print(
            "Target occupations:",
            scheme.target_occupations,
        )
        print(
            "Preferred employment:",
            scheme.preferred_employment,
        )
        print(
            "Preferred education:",
            scheme.preferred_education,
        )

    except Exception:
        db.rollback()
        raise

    finally:
        db.close()


if __name__ == "__main__":
    main()