from app.database.session import SessionLocal
from app.models.scheme import Scheme


URLS = {
    "PM Kisan": "https://pmkisan.gov.in/",
    "Post Matric Scholarship": "https://scholarships.gov.in/",
    "Ayushman Bharat": "https://pmjay.gov.in/",
    "PM Awas Yojana": "https://pmaymis.gov.in/",
    "Skill India": "https://www.skillindiadigital.gov.in/",
}


def main():

    db = SessionLocal()

    try:

        updated = 0

        for scheme_name, official_url in URLS.items():

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

            scheme.official_url = official_url

            updated += 1

            print(
                f"Updated URL: {scheme_name}"
            )

        db.commit()

        print()
        print("Scheme URLs fixed successfully!")
        print(f"Updated: {updated}")

    except Exception:
        db.rollback()
        raise

    finally:
        db.close()


if __name__ == "__main__":
    main()