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
        "requires_land": True,
        "requires_bpl": False,
        "disability_priority": False,
    },

    {
        "scheme_name": "Post Matric Scholarship",
        "category": "Education",
        "target_occupations": ["Student"],
        "preferred_education": [
            "Higher Secondary",
            "Graduate",
            "Post Graduate",
        ],
        "preferred_employment": ["Student"],
        "income_max": 250000,
        "min_age": 16,
        "requires_land": False,
        "requires_bpl": False,
        "disability_priority": False,
    },

    {
        "scheme_name": "Ayushman Bharat",
        "category": "Healthcare",
        "target_occupations": [],
        "preferred_education": [],
        "preferred_employment": [],
        "income_max": 300000,
        "min_age": 0,
        "requires_land": False,
        "requires_bpl": True,
        "disability_priority": True,
    },

    {
        "scheme_name": "PM Awas Yojana",
        "category": "Housing",
        "target_occupations": [],
        "preferred_education": [],
        "preferred_employment": [],
        "income_max": 300000,
        "min_age": 18,
        "requires_land": False,
        "requires_bpl": True,
        "disability_priority": False,
    },

    {
        "scheme_name": "Skill India",
        "category": "Employment",
        "target_occupations": ["Student", "Unemployed"],
        "preferred_education": [
            "Secondary",
            "Higher Secondary",
            "Graduate",
        ],
        "preferred_employment": ["Student", "Unemployed"],
        "income_max": 500000,
        "min_age": 18,
        "requires_land": False,
        "requires_bpl": False,
        "disability_priority": False,
    },
]