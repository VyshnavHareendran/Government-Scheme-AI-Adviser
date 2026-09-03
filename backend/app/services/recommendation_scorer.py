class RecommendationScorer:

    @staticmethod
    def calculate_score(
        features: dict,
    ) -> tuple[int, list[str]]:

        score = 50
        reasons = []

        # -----------------------------
        # Income
        # -----------------------------
        if (
            features["income_limit"] is not None
            and features["annual_income"]
            <= features["income_limit"]
        ):
            score += 15
            reasons.append(
                "Income is within the scheme limit"
            )

        # -----------------------------
        # Age
        # -----------------------------
        age = features["age"]

        minimum_age = features["minimum_age"]
        maximum_age = features["maximum_age"]

        if (
            (minimum_age is None or age >= minimum_age)
            and
            (maximum_age is None or age <= maximum_age)
        ):
            score += 10
            reasons.append(
                "Age satisfies scheme requirements"
            )

        # -----------------------------
        # BPL
        # -----------------------------
        if features["requires_bpl"]:

            if features["bpl_card"]:
                score += 15
                reasons.append(
                    "BPL card requirement satisfied"
                )

        # -----------------------------
        # Land
        # -----------------------------
        if features["requires_land"]:

            if features["land_holding"] > 0:
                score += 10
                reasons.append(
                    "Land requirement satisfied"
                )

        # -----------------------------
        # Occupation
        # -----------------------------
        if features["occupation_match"]:
            score += 10
            reasons.append(
                "Occupation matches scheme preference"
            )

        # -----------------------------
        # Employment
        # -----------------------------
        if features["employment_match"]:
            score += 10
            reasons.append(
                "Employment status matches scheme preference"
            )

        # -----------------------------
        # Education
        # -----------------------------
        if features["education_match"]:
            score += 10
            reasons.append(
                "Education level matches scheme preference"
            )

        # -----------------------------
        # Category
        # -----------------------------
        if features["category_match"]:
            score += 5
            reasons.append(
                "Category matches scheme preference"
            )

        return min(score, 100), reasons