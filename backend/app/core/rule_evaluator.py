from decimal import Decimal
from enum import Enum


class RuleEvaluator:

    @staticmethod
    def evaluate(
        citizen_value,
        operator,
        rule_value,
    ) -> bool:

        # Convert Python Enum values to their stored string values
        if isinstance(citizen_value, Enum):
            citizen_value = citizen_value.value

        # Multiple allowed values
        if operator == "IN":

            allowed_values = [
                value.strip()
                for value in rule_value.split(",")
            ]

            return str(citizen_value) in allowed_values

        # Multiple excluded values
        if operator == "NOT IN":

            excluded_values = [
                value.strip()
                for value in rule_value.split(",")
            ]

            return str(citizen_value) not in excluded_values

        # Boolean conversion
        if isinstance(citizen_value, bool):

            rule_value = rule_value.lower() == "true"

        # Decimal conversion
        elif isinstance(citizen_value, Decimal):

            rule_value = Decimal(rule_value)

        # Integer conversion
        elif isinstance(citizen_value, int):

            rule_value = int(rule_value)

        # Standard operators
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