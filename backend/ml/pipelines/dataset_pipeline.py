"""
Dataset Pipeline

Responsible for building validated datasets for ML training.
Supports multiple data sources while ensuring only valid
CitizenFeatures are stored.
"""

from typing import Iterable

from ml.data.schemas.feature_schema import CitizenFeatures


class DatasetPipeline:
    """Builds validated datasets."""

    def __init__(self):
        self._records: list[CitizenFeatures] = []

    def add(self, feature: CitizenFeatures) -> None:
        """Add a single validated feature."""

        if not isinstance(feature, CitizenFeatures):
            raise TypeError(
                "DatasetPipeline only accepts CitizenFeatures objects."
            )

        self._records.append(feature)

    def extend(
        self,
        features: Iterable[CitizenFeatures],
    ) -> None:
        """Add multiple validated features."""

        for feature in features:
            self.add(feature)

    def build(self) -> list[CitizenFeatures]:
        """Return the validated dataset."""

        return list(self._records)

    @property
    def size(self) -> int:
        """Return dataset size."""

        return len(self._records)

    def clear(self) -> None:
        """Remove all records."""

        self._records.clear()