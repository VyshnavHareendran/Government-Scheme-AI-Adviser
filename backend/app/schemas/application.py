from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ApplicationCreate(BaseModel):
    scheme_id: int


class ApplicationStatusUpdate(BaseModel):
    status: str
    notes: str | None = None


class ApplicationSchemeInfo(BaseModel):
    id: int
    scheme_name: str
    department: str
    official_url: str

    model_config = ConfigDict(from_attributes=True)


class ApplicationResponse(BaseModel):
    id: int
    citizen_id: int
    scheme_id: int
    status: str
    notes: str | None
    created_at: datetime
    updated_at: datetime

    # Scheme information included with application
    scheme: ApplicationSchemeInfo

    model_config = ConfigDict(from_attributes=True)