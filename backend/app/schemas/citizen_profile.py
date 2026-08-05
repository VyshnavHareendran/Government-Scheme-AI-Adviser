from datetime import date, datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict

from app.models.enums import (
    Category,
    EducationLevel,
    EmploymentStatus,
    Gender,
    MaritalStatus,
)


class CitizenProfileCreate(BaseModel):
    date_of_birth: date
    gender: Gender
    state: str
    district: str
    pincode: str
    education_level: EducationLevel
    employment_status: EmploymentStatus
    occupation: str
    annual_income: Decimal
    bpl_card: bool = False
    category: Category
    disability_status: bool = False
    marital_status: MaritalStatus
    land_holding: Decimal = Decimal("0.00")
    family_size: int


class CitizenProfileUpdate(BaseModel):
    date_of_birth: date | None = None
    gender: Gender | None = None
    state: str | None = None
    district: str | None = None
    pincode: str | None = None
    education_level: EducationLevel | None = None
    employment_status: EmploymentStatus | None = None
    occupation: str | None = None
    annual_income: Decimal | None = None
    bpl_card: bool | None = None
    category: Category | None = None
    disability_status: bool | None = None
    marital_status: MaritalStatus | None = None
    land_holding: Decimal | None = None
    family_size: int | None = None


class CitizenProfileResponse(BaseModel):
    id: int
    user_id: int
    date_of_birth: date
    gender: Gender
    state: str
    district: str
    pincode: str
    education_level: EducationLevel
    employment_status: EmploymentStatus
    occupation: str
    annual_income: Decimal
    bpl_card: bool
    category: Category
    disability_status: bool
    marital_status: MaritalStatus
    land_holding: Decimal
    family_size: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)