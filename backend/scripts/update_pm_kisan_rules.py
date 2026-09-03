from app.database.session import SessionLocal
from app.models.eligibility_rule import EligibilityRule
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

        existing_rules = (
            db.query(EligibilityRule)
            .filter(
                EligibilityRule.scheme_id == scheme.id
            )
            .all()
        )

        existing_rule_keys = {
            (
                rule.field_name,
                rule.operator,
                rule.value,
            )
            for rule in existing_rules
        }

        rules_to_add = [
            {
                "field_name": "occupation",
                "operator": "=",
                "value": "Farmer",
            },
            {
                "field_name": "land_holding",
                "operator": ">",
                "value": "0",
            },
        ]

        added = 0

        for rule_data in rules_to_add:

            key = (
                rule_data["field_name"],
                rule_data["operator"],
                rule_data["value"],
            )

            if key in existing_rule_keys:
                continue

            rule = EligibilityRule(
                scheme_id=scheme.id,
                field_name=rule_data["field_name"],
                operator=rule_data["operator"],
                value=rule_data["value"],
            )

            db.add(rule)
            added += 1

        db.commit()

        print(
            f"PM Kisan rules updated successfully! "
            f"Added: {added}"
        )

        rules = (
            db.query(EligibilityRule)
            .filter(
                EligibilityRule.scheme_id == scheme.id
            )
            .all()
        )

        print()
        print("PM Kisan rules:")

        for rule in rules:
            print(
                f"{rule.id} | "
                f"{rule.field_name} "
                f"{rule.operator} "
                f"{rule.value}"
            )

    except Exception:
        db.rollback()
        raise

    finally:
        db.close()


if __name__ == "__main__":
    main()