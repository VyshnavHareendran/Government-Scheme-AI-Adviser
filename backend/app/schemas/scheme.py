from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, HttpUrl


class SchemeCreate(BaseModel):
    scheme_name: str
    category: str
    department: str
    description: str
    official_url: HttpUrl

    # ML eligibility configuration
    income_limit: int | None = None
    minimum_age: int | None = None
    maximum_age: int | None = None
    requires_land: bool = False
    requires_bpl: bool = False
    disability_priority: bool = False
    target_occupations: list[str] = Field(default_factory=list)
    preferred_employment: list[str] = Field(default_factory=list)
    preferred_education: list[str] = Field(default_factory=list)


class SchemeUpdate(BaseModel):
    scheme_name: str | None = None
    category: str | None = None
    department: str | None = None
    description: str | None = None
    official_url: HttpUrl | None = None
    is_active: bool | None = None

    # ML eligibility configuration
    income_limit: int | None = None
    minimum_age: int | None = None
    maximum_age: int | None = None
    requires_land: bool | None = None
    requires_bpl: bool | None = None
    disability_priority: bool | None = None
    target_occupations: list[str] | None = None
    preferred_employment: list[str] | None = None
    preferred_education: list[str] | None = None


class SchemeResponse(BaseModel):
    id: int
    scheme_name: str
    category: str
    department: str
    description: str
    official_url: str
    is_active: bool

    # ML eligibility configuration
    income_limit: int | None
    minimum_age: int | None
    maximum_age: int | None
    requires_land: bool
    requires_bpl: bool
    disability_priority: bool
    target_occupations: list[str]
    preferred_employment: list[str]
    preferred_education: list[str]

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)