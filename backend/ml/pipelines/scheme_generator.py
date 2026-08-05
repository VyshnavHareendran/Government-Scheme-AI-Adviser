"""
Scheme Generator

Provides scheme metadata for ML dataset generation.
"""

from ml.config.schemes import SCHEMES


class SchemeGenerator:
    """Provides all available government schemes."""

    def get_all_schemes(self):
        return SCHEMES