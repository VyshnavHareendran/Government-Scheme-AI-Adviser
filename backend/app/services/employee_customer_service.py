import secrets
import string

from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.models.user import User
from app.repositories.employee_customer_repository import (
    EmployeeCustomerRepository,
)


class EmployeeCustomerService:

    @staticmethod
    def _generate_temporary_password() -> str:
        alphabet = string.ascii_letters + string.digits

        return (
            "Tmp-"
            + "".join(
                secrets.choice(alphabet)
                for _ in range(10)
            )
        )

    @staticmethod
    def get_customers(
        db: Session,
        search: str | None = None,
        status_filter: str = "all",
    ) -> list[User]:

        return EmployeeCustomerRepository.get_customers(
            db=db,
            search=search,
            status_filter=status_filter,
        )

    @staticmethod
    def get_customer(
        db: Session,
        customer_id: int,
    ) -> User | None:

        return EmployeeCustomerRepository.get_customer_by_id(
            db=db,
            customer_id=customer_id,
        )

    @staticmethod
    def create_customer(
        db: Session,
        full_name: str,
        email: str,
    ) -> tuple[User, str]:

        full_name = full_name.strip()
        email = email.strip().lower()

        if not full_name:
            raise ValueError("Full name is required.")

        if not email:
            raise ValueError("Email is required.")

        existing_user = (
            db.query(User)
            .filter(User.email == email)
            .first()
        )

        if existing_user:
            raise ValueError(
                "An account with this email already exists."
            )

        temporary_password = (
            EmployeeCustomerService
            ._generate_temporary_password()
        )

        customer = (
            EmployeeCustomerRepository.create_customer(
                db=db,
                full_name=full_name,
                email=email,
                password_hash=hash_password(
                    temporary_password
                ),
                must_change_password=True,
            )
        )

        return customer, temporary_password

    @staticmethod
    def update_customer(
        db: Session,
        customer_id: int,
        full_name: str,
        email: str,
    ) -> User:

        full_name = full_name.strip()
        email = email.strip().lower()

        if not full_name:
            raise ValueError("Full name is required.")

        if not email:
            raise ValueError("Email is required.")

        customer = (
            EmployeeCustomerRepository.get_customer_by_id(
                db=db,
                customer_id=customer_id,
            )
        )

        if not customer:
            raise ValueError("Customer not found.")

        existing_user = (
            db.query(User)
            .filter(
                User.email == email,
                User.id != customer_id,
            )
            .first()
        )

        if existing_user:
            raise ValueError(
                "An account with this email already exists."
            )

        return EmployeeCustomerRepository.update_customer(
            db=db,
            customer=customer,
            full_name=full_name,
            email=email,
        )

    @staticmethod
    def update_customer_status(
        db: Session,
        customer_id: int,
        is_active: bool,
    ) -> User:

        customer = (
            EmployeeCustomerRepository.get_customer_by_id(
                db=db,
                customer_id=customer_id,
            )
        )

        if not customer:
            raise ValueError("Customer not found.")

        return (
            EmployeeCustomerRepository
            .update_customer_status(
                db=db,
                customer=customer,
                is_active=is_active,
            )
        )

    @staticmethod
    def reset_customer_password(
        db: Session,
        customer_id: int,
    ) -> tuple[User, str]:

        customer = (
            EmployeeCustomerRepository.get_customer_by_id(
                db=db,
                customer_id=customer_id,
            )
        )

        if not customer:
            raise ValueError("Customer not found.")

        temporary_password = (
            EmployeeCustomerService
            ._generate_temporary_password()
        )

        updated_customer = (
            EmployeeCustomerRepository
            .reset_customer_password(
                db=db,
                customer=customer,
                password_hash=hash_password(
                    temporary_password
                ),
            )
        )

        return updated_customer, temporary_password

    @staticmethod
    def delete_customer(
        db: Session,
        customer_id: int,
    ) -> None:

        customer = (
            EmployeeCustomerRepository.get_customer_by_id(
                db=db,
                customer_id=customer_id,
            )
        )

        if not customer:
            raise ValueError("Customer not found.")

        EmployeeCustomerRepository.delete_customer(
            db=db,
            customer=customer,
        )