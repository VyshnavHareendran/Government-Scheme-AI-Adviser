"""
Dataset Builder V2

Builds the production-ready
training dataset using scheme
properties instead of scheme names.
"""

from ml.pipelines.citizen_generator import CitizenGenerator
from ml.pipelines.scheme_generator import SchemeGenerator
from ml.pipelines.training_example_builder_v2 import (
    TrainingExampleBuilderV2,
)
from ml.rules.eligibility_engine import EligibilityEngine


class DatasetBuilderV2:
    """Builds the V2 ML training dataset."""

    def __init__(self):

        self.generator = CitizenGenerator()

        self.scheme_generator = SchemeGenerator()

        self.example_builder = (
            TrainingExampleBuilderV2()
        )

        self.eligibility_engine = (
            EligibilityEngine()
        )

    def build_training_dataset(
        self,
        citizens_count: int,
    ):

        dataset = []

        for citizen_id in range(
            1,
            citizens_count + 1,
        ):

            citizen = self.generator.generate()

            schemes = (
                self.scheme_generator.get_all_schemes()
            )

            for scheme in schemes:

                eligible = (
                    self.eligibility_engine.is_eligible(
                        citizen,
                        scheme,
                    )
                )

                example = (
                    self.example_builder.build(
                        citizen=citizen,
                        scheme=scheme,
                        eligible=eligible,
                    )
                )

                example["citizen_id"] = citizen_id

                dataset.append(example)

        return dataset