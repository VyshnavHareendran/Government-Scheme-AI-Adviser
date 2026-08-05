from enum import Enum


class Gender(str, Enum):
    MALE = "Male"
    FEMALE = "Female"
    OTHER = "Other"


class Category(str, Enum):
    GENERAL = "General"
    OBC = "OBC"
    SC = "SC"
    ST = "ST"
    EWS = "EWS"


class EducationLevel(str, Enum):
    SSLC = "SSLC"
    PLUS_TWO = "Plus Two"
    DIPLOMA = "Diploma"
    UG = "UG"
    PG = "PG"
    PHD = "PhD"


class EmploymentStatus(str, Enum):
    STUDENT = "Student"
    EMPLOYED = "Employed"
    SELF_EMPLOYED = "Self Employed"
    UNEMPLOYED = "Unemployed"
    RETIRED = "Retired"


class MaritalStatus(str, Enum):
    SINGLE = "Single"
    MARRIED = "Married"
    DIVORCED = "Divorced"
    WIDOWED = "Widowed"


class RuleOperator(str, Enum):
    EQUAL = "="
    NOT_EQUAL = "!="
    GREATER_THAN = ">"
    GREATER_THAN_EQUAL = ">="
    LESS_THAN = "<"
    LESS_THAN_EQUAL = "<="