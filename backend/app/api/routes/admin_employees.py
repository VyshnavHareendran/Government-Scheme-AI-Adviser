from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.permissions import require_admin
from app.database.dependencies import get_db
from app.models.user import User
from app.services.admin_employee_service import (
    AdminEmployeeService,
)
from app.schemas.admin_employee import (
    AdminEmployeeCreate,
    AdminEmployeeCreateResponse,
    AdminEmployeeDetail,
    AdminEmployeeListItem,
    AdminEmployeeStatusUpdate,
    AdminEmployeeUpdate,
    AdminEmployeeResetPasswordResponse,
)


router = APIRouter(
    prefix="/admin/employees",
    tags=["Admin Employees"],
)


@router.get(
    "/",
    response_model=list[AdminEmployeeListItem],
)
def get_admin_employees(
    search: str | None = Query(
        default=None,
        description="Search by employee name or email.",
    ),
    status_filter: str = Query(
        default="all",
        alias="status",
        pattern="^(all|active|inactive)$",
    ),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    employees = AdminEmployeeService.get_employees(
        db=db,
        search=search,
        status_filter=status_filter,
    )

    return employees

@router.post(
    "/",
    response_model=AdminEmployeeCreateResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_admin_employee(
    employee: AdminEmployeeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    try:
        created_employee, temporary_password = (
            AdminEmployeeService.create_employee(
                db=db,
                full_name=employee.full_name,
                email=employee.email,
            )
        )

        return {
            "employee": created_employee,
            "temporary_password": temporary_password,
        }

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )

@router.post(
    "/{employee_id}/reset-password",
    response_model=AdminEmployeeResetPasswordResponse,
)
def reset_employee_password(
    employee_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    try:
        employee, temporary_password = (
            AdminEmployeeService.reset_employee_password(
                db=db,
                employee_id=employee_id,
            )
        )

        return {
            "employee": employee,
            "temporary_password": temporary_password,
        }

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        )

@router.put(
    "/{employee_id}",
    response_model=AdminEmployeeDetail,
)
def update_admin_employee(
    employee_id: int,
    employee: AdminEmployeeUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    try:
        updated_employee = AdminEmployeeService.update_employee(
            db=db,
            employee_id=employee_id,
            full_name=employee.full_name,
            email=employee.email,
        )

        return updated_employee

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )


@router.get(
    "/{employee_id}",
    response_model=AdminEmployeeDetail,
)
def get_admin_employee(
    employee_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    employee = AdminEmployeeService.get_employee(
        db=db,
        employee_id=employee_id,
    )

    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found.",
        )

    return employee

@router.patch(
    "/{employee_id}/status",
    response_model=AdminEmployeeDetail,
)
def update_employee_status(
    employee_id: int,
    payload: AdminEmployeeStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    try:
        return AdminEmployeeService.update_employee_status(
            db=db,
            employee_id=employee_id,
            is_active=payload.is_active,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        )


@router.delete(
    "/{employee_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_admin_employee(
    employee_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    try:
        AdminEmployeeService.delete_employee(
            db=db,
            employee_id=employee_id,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        )