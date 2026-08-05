class RecommendationScorer:

    @staticmethod
    def calculate_score(features: dict) -> tuple[int, list[str]]:

        score = 50
        reasons = []

        if features["annual_income"] <= 200000:
            score += 15
            reasons.append("Income satisfies scheme preference")

        if features["bpl_card"]:
            score += 10
            reasons.append("BPL card holder")

        if features["disability_status"]:
            score += 10
            reasons.append("Disability support applicable")

        if features["occupation"]:
            score += 5
            reasons.append(f"Occupation: {features['occupation']}")

        if features["education_level"]:
            score += 5
            education = features["education_level"]

            if hasattr(education, "value"):
                education = education.value

            if education:
                score += 5
                reasons.append(f"Education: {education}")

        if features["age"] >= 18:
            score += 5
            reasons.append("Eligible age")

        return min(score, 100), reasons