from datetime import datetime

from pydantic import BaseModel, ConfigDict, HttpUrl


class SchemeCreate(BaseModel):
    scheme_name: str
    category: str
    department: str
    description: str
    official_url: HttpUrl


class SchemeUpdate(BaseModel):
    scheme_name: str | None = None
    category: str | None = None
    department: str | None = None
    description: str | None = None
    official_url: HttpUrl | None = None
    is_active: bool | None = None


class SchemeResponse(BaseModel):
    id: int
    scheme_name: str
    category: str
    department: str
    description: str
    official_url: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)