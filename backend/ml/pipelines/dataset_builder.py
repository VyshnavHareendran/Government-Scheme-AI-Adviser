"""
Dataset Builder

Generates labeled training data for the ML model.
"""

from ml.pipelines.citizen_generator import CitizenGenerator
from ml.pipelines.scheme_generator import SchemeGenerator
from ml.pipelines.training_example_builder import TrainingExampleBuilder
from ml.rules.eligibility_engine import EligibilityEngine

class DatasetBuilder:
    """Builds synthetic training datasets."""

    def __init__(self):
        self.generator = CitizenGenerator()
        self.scheme_generator = SchemeGenerator()
        self.example_builder = TrainingExampleBuilder()
        self.eligibility_engine = EligibilityEngine()

    def generate_citizen(self):
        """
        Generate a single synthetic citizen.
        """
        return self.generator.generate()

    def generate_dataset(self, size: int):
        """
        Generate a list of synthetic citizens.

        Args:
            size: Number of citizens to generate.

        Returns:
            List of CitizenFeatures.
        """
        dataset = []

        for _ in range(size):
            citizen = self.generate_citizen()
            dataset.append(citizen)

        return dataset

    def generate_training_examples(self):
        """
        Temporary method.

        Generates training examples for ONE citizen.
        """

        citizen = self.generate_citizen()

        schemes = self.scheme_generator.get_all_schemes()

        examples = []

        for scheme in schemes:

            example = self.example_builder.build(
                citizen=citizen,
                scheme=scheme,
                eligible=self.eligibility_engine.is_eligible(
                    citizen,
                    scheme,
                ),      # Temporary placeholder
            )

            examples.append(example)

        return examples

    def build_training_dataset(
    self,
    citizens_count: int,
    ):
        """
        Generate the complete ML training dataset.

        One citizen generates one training row
        per available scheme.
        """

        dataset = []

        for citizen_id in range(1, citizens_count + 1):

            citizen = self.generate_citizen()

            schemes = self.scheme_generator.get_all_schemes()

            for scheme in schemes:

                eligible = self.eligibility_engine.is_eligible(
                    citizen,
                    scheme,
                )

                example = self.example_builder.build(
                    citizen=citizen,
                    scheme=scheme,
                    eligible=eligible,
                )

                example["citizen_id"] = citizen_id

                dataset.append(example)

        return dataset