from pydantic import BaseModel, ConfigDict, EmailStr


class EmployeeCustomerCreate(BaseModel):
    full_name: str
    email: EmailStr


class EmployeeCustomerUpdate(BaseModel):
    full_name: str
    email: EmailStr


class EmployeeCustomerStatusUpdate(BaseModel):
    is_active: bool


class EmployeeCustomerResponse(BaseModel):
    id: int
    full_name: str
    email: str
    role: str
    is_active: bool
    must_change_password: bool

    model_config = ConfigDict(from_attributes=True)


class EmployeeCustomerCreateResponse(BaseModel):
    customer: EmployeeCustomerResponse
    temporary_password: str


class EmployeeCustomerResetPasswordResponse(BaseModel):
    customer: EmployeeCustomerResponse
    temporary_password: str