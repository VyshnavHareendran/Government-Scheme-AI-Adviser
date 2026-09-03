from sqlalchemy.orm import Session

from app.models.application import Application
from app.repositories.application_repository import (
    ApplicationRepository,
)
from app.repositories.employee_customer_repository import (
    EmployeeCustomerRepository,
)
from app.repositories.scheme_repository import SchemeRepository


class ApplicationService:

    @staticmethod
    def create_application(
        db: Session,
        citizen_id: int,
        scheme_id: int,
    ) -> Application:

        # Verify scheme exists
        scheme = SchemeRepository.get_by_id(
            db,
            scheme_id,
        )

        if not scheme:
            raise ValueError("Scheme not found.")

        if not scheme.is_active:
            raise ValueError("This scheme is not currently active.")

        # Check whether citizen already applied
        existing = (
            db.query(Application)
            .filter(
                Application.citizen_id == citizen_id,
                Application.scheme_id == scheme_id,
            )
            .first()
        )

        if existing:
            raise ValueError(
                "You have already started an application for this scheme. You can track it from My Applications."
            )

        return ApplicationRepository.create(
            db=db,
            citizen_id=citizen_id,
            scheme_id=scheme_id,
        )

    @staticmethod
    def get_my_applications(
        db: Session,
        citizen_id: int,
    ) -> list[Application]:

        return ApplicationRepository.get_by_citizen(
            db,
            citizen_id,
        )

    @staticmethod
    def get_customer_applications(
        db: Session,
        customer_id: int,
    ) -> list[Application]:

        customer = EmployeeCustomerRepository.get_customer_by_id(
            db=db,
            customer_id=customer_id,
        )

        if not customer:
            raise ValueError("Customer not found.")

        return ApplicationRepository.get_by_citizen(
            db=db,
            citizen_id=customer.id,
        )

    @staticmethod
    def get_all_applications(
        db: Session,
    ) -> list[Application]:

        return ApplicationRepository.get_all(db)

    @staticmethod
    def update_application_status(
        db: Session,
        application_id: int,
        status: str,
        notes: str | None = None,
    ) -> Application:

        application = ApplicationRepository.get_by_id(
            db,
            application_id,
        )

        if not application:
            raise ValueError("Application not found.")

        allowed_statuses = {
            "Not Started",
            "In Progress",
            "Submitted",
            "Under Review",
            "Approved",
            "Rejected",
        }

        if status not in allowed_statuses:
            raise ValueError(
                "Invalid application status."
            )

        return ApplicationRepository.update_status(
            db=db,
            application=application,
            status=status,
            notes=notes,
        )
