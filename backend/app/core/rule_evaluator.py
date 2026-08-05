from decimal import Decimal


class RuleEvaluator:
    @staticmethod
    def evaluate(
        citizen_value,
        operator,
        rule_value,
    ) -> bool:

        if isinstance(citizen_value, Decimal):
            rule_value = Decimal(rule_value)

        elif isinstance(citizen_value, bool):
            rule_value = rule_value.lower() == "true"

        elif isinstance(citizen_value, int):
            rule_value = int(rule_value)

        if operator == "=":
            return citizen_value == rule_value

        elif operator == "!=":
            return citizen_value != rule_value

        elif operator == ">":
            return citizen_value > rule_value

        elif operator == ">=":
            return citizen_value >= rule_value

        elif operator == "<":
            return citizen_value < rule_value

        elif operator == "<=":
            return citizen_value <= rule_value

        return False