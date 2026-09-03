from sqlalchemy.orm import Session

from app.models.user import User


class EmployeeCustomerRepository:

    @staticmethod
    def get_customers(
        db: Session,
        search: str | None = None,
        status_filter: str = "all",
    ) -> list[User]:

        query = (
            db.query(User)
            .filter(User.role == "citizen")
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
    def get_customer_by_id(
        db: Session,
        customer_id: int,
    ) -> User | None:

        return (
            db.query(User)
            .filter(
                User.id == customer_id,
                User.role == "citizen",
            )
            .first()
        )

    @staticmethod
    def get_customer_by_email(
        db: Session,
        email: str,
    ) -> User | None:

        return (
            db.query(User)
            .filter(
                User.email == email,
                User.role == "citizen",
            )
            .first()
        )

    @staticmethod
    def create_customer(
        db: Session,
        full_name: str,
        email: str,
        password_hash: str,
        must_change_password: bool = True,
    ) -> User:

        customer = User(
            full_name=full_name,
            email=email,
            password_hash=password_hash,
            role="citizen",
            is_active=True,
            must_change_password=must_change_password,
        )

        db.add(customer)
        db.commit()
        db.refresh(customer)

        return customer

    @staticmethod
    def update_customer(
        db: Session,
        customer: User,
        full_name: str,
        email: str,
    ) -> User:

        customer.full_name = full_name
        customer.email = email

        db.commit()
        db.refresh(customer)

        return customer

    @staticmethod
    def update_customer_status(
        db: Session,
        customer: User,
        is_active: bool,
    ) -> User:

        customer.is_active = is_active

        db.commit()
        db.refresh(customer)

        return customer

    @staticmethod
    def reset_customer_password(
        db: Session,
        customer: User,
        password_hash: str,
    ) -> User:

        customer.password_hash = password_hash
        customer.must_change_password = True

        db.commit()
        db.refresh(customer)

        return customer

    @staticmethod
    def delete_customer(
        db: Session,
        customer: User,
    ) -> None:

        db.delete(customer)
        db.commit()