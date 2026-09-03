from sqlalchemy.orm import Session

from app.models.user import User


class AdminEmployeeRepository:

    @staticmethod
    def get_employees(
        db: Session,
        search: str | None = None,
        status_filter: str = "all",
    ) -> list[User]:

        query = (
            db.query(User)
            .filter(User.role == "employee")
        )

        if search:
            search_term = f"%{search.strip()}%"

            query = query.filter(
                (User.full_name.ilike(search_term))
                | (User.email.ilike(search_term))
            )

        if status_filter == "active":
            query = query.filter(
                User.is_active.is_(True)
            )

        elif status_filter == "inactive":
            query = query.filter(
                User.is_active.is_(False)
            )

        return (
            query
            .order_by(User.created_at.desc())
            .all()
        )

    @staticmethod
    def get_employee_by_id(
        db: Session,
        employee_id: int,
    ) -> User | None:

        return (
            db.query(User)
            .filter(
                User.id == employee_id,
                User.role == "employee",
            )
            .first()
        )

    @staticmethod
    def create_employee(
        db: Session,
        full_name: str,
        email: str,
        password_hash: str,
        must_change_password: bool = True,
    ) -> User:

        employee = User(
            full_name=full_name,
            email=email,
            password_hash=password_hash,
            role="employee",
            is_active=True,
            must_change_password=must_change_password,
        )

        db.add(employee)
        db.commit()
        db.refresh(employee)

        return employee

    @staticmethod
    def get_employee_by_email(
        db: Session,
        email: str,
    ) -> User | None:

        return (
            db.query(User)
            .filter(
                User.email == email,
                User.role == "employee",
            )
            .first()
        )

    @staticmethod
    def update_employee(
        db: Session,
        employee: User,
        full_name: str,
        email: str,
    ) -> User:

        employee.full_name = full_name
        employee.email = email

        db.commit()
        db.refresh(employee)

        return employee

    @staticmethod
    def update_employee_status(
        db: Session,
        employee: User,
        is_active: bool,
    ) -> User:

        employee.is_active = is_active

        db.commit()
        db.refresh(employee)

        return employee

    @staticmethod
    def update_employee_status(
        db: Session,
        employee: User,
        is_active: bool,
    ) -> User:

        employee.is_active = is_active

        db.commit()
        db.refresh(employee)

        return employee

    @staticmethod
    def delete_employee(
        db: Session,
        employee: User,
    ) -> None:

        db.delete(employee)
        db.commit()

