from sqlalchemy.orm import Session

from app.models.user import User
from app.repositories.admin_employee_repository import (
    AdminEmployeeRepository,
)

import secrets
import string

from app.core.security import hash_password


class AdminEmployeeService:

    @staticmethod
    def get_employees(
        db: Session,
        search: str | None = None,
        status_filter: str = "all",
    ) -> list[User]:

        return AdminEmployeeRepository.get_employees(
            db=db,
            search=search,
            status_filter=status_filter,
        )

    @staticmethod
    def get_employee(
        db: Session,
        employee_id: int,
    ) -> User | None:

        return AdminEmployeeRepository.get_employee_by_id(
            db=db,
            employee_id=employee_id,
        )

    @staticmethod
    def update_employee_status(
        db: Session,
        employee_id: int,
        is_active: bool,
    ) -> User:

        employee = AdminEmployeeRepository.get_employee_by_id(
            db=db,
            employee_id=employee_id,
        )

        if not employee:
            raise ValueError("Employee not found.")

        return AdminEmployeeRepository.update_employee_status(
            db=db,
            employee=employee,
            is_active=is_active,
        )

    @staticmethod
    def create_employee(
        db: Session,
        full_name: str,
        email: str,
    ) -> tuple[User, str]:

        existing_employee = (
            AdminEmployeeRepository.get_employee_by_email(
                db=db,
                email=email,
            )
        )

        if existing_employee:
            raise ValueError(
                "An employee with this email already exists."
            )

        existing_user = (
            db.query(User)
            .filter(User.email == email)
            .first()
        )

        if existing_user:
            raise ValueError(
                "An account with this email already exists."
            )

        alphabet = string.ascii_letters + string.digits

        temporary_password = (
            "Tmp-"
            + "".join(
                secrets.choice(alphabet)
                for _ in range(10)
            )
        )

        employee = AdminEmployeeRepository.create_employee(
            db=db,
            full_name=full_name.strip(),
            email=email.lower().strip(),
            password_hash=hash_password(
                temporary_password
            ),
            must_change_password=True,
        )

        return employee, temporary_password

    @staticmethod
    def reset_employee_password(
        db: Session,
        employee_id: int,
    ) -> tuple[User, str]:

        employee = (
            AdminEmployeeRepository.get_employee_by_id(
                db=db,
                employee_id=employee_id,
            )
        )

        if not employee:
            raise ValueError("Employee not found.")

        alphabet = string.ascii_letters + string.digits

        temporary_password = (
            "Tmp-"
            + "".join(
                secrets.choice(alphabet)
                for _ in range(10)
            )
        )

        employee.password_hash = hash_password(
            temporary_password
        )
        employee.must_change_password = True

        db.commit()
        db.refresh(employee)

        return employee, temporary_password

    @staticmethod
    def update_employee(
        db: Session,
        employee_id: int,
        full_name: str,
        email: str,
    ) -> User:

        employee = AdminEmployeeRepository.get_employee_by_id(
            db=db,
            employee_id=employee_id,
        )

        if not employee:
            raise ValueError("Employee not found.")

        existing_user = (
            db.query(User)
            .filter(
                User.email == email.lower().strip(),
                User.id != employee_id,
            )
            .first()
        )

        if existing_user:
            raise ValueError(
                "An account with this email already exists."
            )

        return AdminEmployeeRepository.update_employee(
            db=db,
            employee=employee,
            full_name=full_name,
            email=email,
        )

    @staticmethod
    def delete_employee(
        db: Session,
        employee_id: int,
    ) -> None:

        employee = AdminEmployeeRepository.get_employee_by_id(
            db=db,
            employee_id=employee_id,
        )

        if not employee:
            raise ValueError("Employee not found.")

        AdminEmployeeRepository.delete_employee(
            db=db,
            employee=employee,
        )