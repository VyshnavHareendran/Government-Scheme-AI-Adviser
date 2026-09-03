from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr


class AdminEmployeeCreate(BaseModel):
    full_name: str
    email: EmailStr


class AdminEmployeeListItem(BaseModel):
    id: int
    full_name: str
    email: str
    role: str
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AdminEmployeeDetail(BaseModel):
    id: int
    full_name: str
    email: str
    role: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AdminEmployeeCreateResponse(BaseModel):
    employee: AdminEmployeeDetail
    temporary_password: str

class AdminEmployeeStatusUpdate(BaseModel):
    is_active: bool

class AdminEmployeeUpdate(BaseModel):
    full_name: str
    email: EmailStr

class AdminEmployeeResetPasswordResponse(BaseModel):
    employee: AdminEmployeeDetail
    temporary_password: str