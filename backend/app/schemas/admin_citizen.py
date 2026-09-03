from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.schemas.citizen_profile import CitizenProfileResponse


class AdminCitizenListItem(BaseModel):
    id: int
    full_name: str
    email: str
    role: str
    is_active: bool
    created_at: datetime
    has_profile: bool
    profile_completion: int

    model_config = ConfigDict(from_attributes=True)


class AdminCitizenDetail(BaseModel):
    id: int
    full_name: str
    email: str
    role: str
    is_active: bool
    created_at: datetime
    updated_at: datetime
    profile: CitizenProfileResponse | None = None

    model_config = ConfigDict(from_attributes=True)