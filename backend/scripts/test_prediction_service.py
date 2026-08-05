from ml.inference.prediction_service import PredictionService


def main():

    citizen = {
        "age": 24,
        "gender": "Male",
        "state": "Kerala",
        "category": "OBC",
        "annual_income": 120000,
        "occupation": "Student",
        "employment_status": "Student",
        "education_level": "Graduate",
        "family_size": 4,
        "land_holding": 0.0,
        "bpl_card": False,
        "disability_status": False,
        "scheme_name": "Post Matric Scholarship",
        "scheme_category": "Education",
    }

    result = PredictionService.predict(citizen)

    print()

    print(result)


if __name__ == "__main__":
    main()