"""
Master Scheme Configuration

This file acts as the single source of truth for all
government schemes used by the ML pipeline.

Used by:
- Dataset Generator
- Label Generator
- ML Training
- Future Recommendation Engine
"""

SCHEMES = [
    {
        "scheme_name": "PM Kisan",
        "category": "Agriculture",
        "target_occupations": ["Farmer"],
        "preferred_education": [],
        "preferred_employment": ["Self-Employed"],
        "income_max": 200000,
        "min_age": 18,
        "max_age": 120,
        "requires_land": True,
        "requires_bpl": False,
        "disability_priority": False,
        "target_categories": [],
    },

    {
        "scheme_name": "Post Matric Scholarship",
        "category": "Education",
        "target_occupations": [],
        "preferred_education": [
            "Plus Two",
            "UG",
            "PG",
        ],
        "preferred_employment": ["Student"],
        "income_max": 250000,
        "min_age": 16,
        "max_age": 120,
        "requires_land": False,
        "requires_bpl": False,
        "disability_priority": False,
        "target_categories": [],
    },

    {
        "scheme_name": "Ayushman Bharat",
        "category": "Healthcare",
        "target_occupations": [],
        "preferred_education": [],
        "preferred_employment": [],
        "income_max": 300000,
        "min_age": 0,
        "max_age": 120,
        "requires_land": False,
        "requires_bpl": True,
        "disability_priority": True,
        "target_categories": [],
    },

    {
        "scheme_name": "PM Awas Yojana",
        "category": "Housing",
        "target_occupations": [],
        "preferred_education": [],
        "preferred_employment": [],
        "income_max": 300000,
        "min_age": 18,
        "max_age": 120,
        "requires_land": False,
        "requires_bpl": True,
        "disability_priority": False,
        "target_categories": [],
    },

    {
        "scheme_name": "Skill India",
        "category": "Employment",
        "target_occupations": [],
        "preferred_education": [
            "SSLC",
            "Plus Two",
            "Diploma",
            "UG",
        ],
        "preferred_employment": [
            "Student",
            "Unemployed",
        ],
        "income_max": 500000,
        "min_age": 18,
        "max_age": 120,
        "requires_land": False,
        "requires_bpl": False,
        "disability_priority": False,
        "target_categories": [],
    },
]