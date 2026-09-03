from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.permissions import require_employee
from app.database.dependencies import get_db
from app.models.user import User
from app.schemas.employee_customer import (
    EmployeeCustomerCreate,
    EmployeeCustomerCreateResponse,
    EmployeeCustomerResponse,
    EmployeeCustomerResetPasswordResponse,
    EmployeeCustomerStatusUpdate,
    EmployeeCustomerUpdate,
)
from app.services.employee_customer_service import (
    EmployeeCustomerService,
)
from app.repositories.employee_customer_repository import (
    EmployeeCustomerRepository,
)
from app.schemas.citizen_profile import (
    CitizenProfileCreate,
    CitizenProfileResponse,
    CitizenProfileUpdate,
)
from app.services.citizen_profile_service import CitizenProfileService
from app.services.rule_engine_service import RuleEngineService
from app.services.ai_recommendation_service import AIRecommendationService
from app.schemas.application import ApplicationResponse
from app.services.application_service import ApplicationService

router = APIRouter(
    prefix="/employee/customers",
    tags=["Employee Customers"],
)


@router.get(
    "/",
    response_model=list[EmployeeCustomerResponse],
)
def get_customers(
    search: str | None = Query(
        default=None,
        description="Search by customer name or email.",
    ),
    status_filter: str = Query(
        default="all",
        alias="status",
        pattern="^(all|active|inactive)$",
    ),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_employee),
):
    return EmployeeCustomerService.get_customers(
        db=db,
        search=search,
        status_filter=status_filter,
    )


@router.post(
    "/",
    response_model=EmployeeCustomerCreateResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_customer(
    payload: EmployeeCustomerCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_employee),
):
    try:
        customer, temporary_password = (
            EmployeeCustomerService.create_customer(
                db=db,
                full_name=payload.full_name,
                email=payload.email,
            )
        )

        return {
            "customer": customer,
            "temporary_password": temporary_password,
        }

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )

@router.get(
    "/{customer_id}/profile",
    response_model=CitizenProfileResponse,
)
def get_customer_profile(
    customer_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_employee),
):
    customer = EmployeeCustomerRepository.get_customer_by_id(
        db=db,
        customer_id=customer_id,
    )

    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found.",
        )

    profile = CitizenProfileService.get_profile(
        db=db,
        user_id=customer.id,
    )

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Citizen profile not found.",
        )

    return profile

@router.post(
    "/{customer_id}/profile",
    response_model=CitizenProfileResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_customer_profile(
    customer_id: int,
    profile: CitizenProfileCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_employee),
):
    customer = EmployeeCustomerRepository.get_customer_by_id(
        db=db,
        customer_id=customer_id,
    )

    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found.",
        )

    try:
        return CitizenProfileService.create_profile(
            db=db,
            user_id=customer.id,
            profile=profile,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )

@router.put(
    "/{customer_id}/profile",
    response_model=CitizenProfileResponse,
)
def update_customer_profile(
    customer_id: int,
    profile: CitizenProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_employee),
):
    customer = EmployeeCustomerRepository.get_customer_by_id(
        db=db,
        customer_id=customer_id,
    )

    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found.",
        )

    try:
        return CitizenProfileService.update_profile(
            db=db,
            user_id=customer.id,
            profile=profile,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        )

@router.delete(
    "/{customer_id}/profile",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_customer_profile(
    customer_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_employee),
):
    customer = EmployeeCustomerRepository.get_customer_by_id(
        db=db,
        customer_id=customer_id,
    )

    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found.",
        )

    try:
        CitizenProfileService.delete_profile(
            db=db,
            user_id=customer.id,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        )

@router.get(
    "/{customer_id}/eligibility",
)
def get_customer_eligibility(
    customer_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_employee),
):
    customer = EmployeeCustomerRepository.get_customer_by_id(
        db=db,
        customer_id=customer_id,
    )

    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found.",
        )

    try:
        schemes = RuleEngineService.get_eligible_schemes(
            db=db,
            user_id=customer.id,
        )

        return {
            "eligible_count": len(schemes),
            "eligible_schemes": [
                {
                    "id": scheme.id,
                    "scheme_name": scheme.scheme_name,
                    "category": scheme.category,
                    "department": scheme.department,
                    "description": scheme.description,
                    "official_url": scheme.official_url,
                }
                for scheme in schemes
            ],
        }

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        )


@router.get(
    "/{customer_id}/recommendations",
)
def get_customer_recommendations(
    customer_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_employee),
):
    customer = EmployeeCustomerRepository.get_customer_by_id(
        db=db,
        customer_id=customer_id,
    )

    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found.",
        )

    try:
        recommendations = AIRecommendationService.get_recommendations(
            db=db,
            user_id=customer.id,
        )

        return {
            "recommendation_count": len(recommendations),
            "recommendations": recommendations,
        }

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        )


@router.get(
    "/{customer_id}/applications",
    response_model=list[ApplicationResponse],
)
def get_customer_applications(
    customer_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_employee),
):
    try:
        return ApplicationService.get_customer_applications(
            db=db,
            customer_id=customer_id,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        )


@router.get(
    "/{customer_id}",
    response_model=EmployeeCustomerResponse,
)
def get_customer(
    customer_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_employee),
):
    customer = EmployeeCustomerService.get_customer(
        db=db,
        customer_id=customer_id,
    )

    if not customer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found.",
        )

    return customer


@router.put(
    "/{customer_id}",
    response_model=EmployeeCustomerResponse,
)
def update_customer(
    customer_id: int,
    payload: EmployeeCustomerUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_employee),
):
    try:
        return EmployeeCustomerService.update_customer(
            db=db,
            customer_id=customer_id,
            full_name=payload.full_name,
            email=payload.email,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )


@router.patch(
    "/{customer_id}/status",
    response_model=EmployeeCustomerResponse,
)
def update_customer_status(
    customer_id: int,
    payload: EmployeeCustomerStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_employee),
):
    try:
        return EmployeeCustomerService.update_customer_status(
            db=db,
            customer_id=customer_id,
            is_active=payload.is_active,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        )


@router.post(
    "/{customer_id}/reset-password",
    response_model=EmployeeCustomerResetPasswordResponse,
)
def reset_customer_password(
    customer_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_employee),
):
    try:
        customer, temporary_password = (
            EmployeeCustomerService.reset_customer_password(
                db=db,
                customer_id=customer_id,
            )
        )

        return {
            "customer": customer,
            "temporary_password": temporary_password,
        }

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        )


@router.delete(
    "/{customer_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_customer(
    customer_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_employee),
):
    try:
        EmployeeCustomerService.delete_customer(
            db=db,
            customer_id=customer_id,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        )
