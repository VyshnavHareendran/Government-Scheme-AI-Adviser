from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.permissions import require_citizen, require_employee
from app.database.dependencies import (
    get_db,
)
from app.models.user import User
from app.schemas.application import (
    ApplicationCreate,
    ApplicationResponse,
    ApplicationStatusUpdate,
)
from app.services.application_service import (
    ApplicationService,
)

router = APIRouter(
    prefix="/applications",
    tags=["Applications"],
)


# =========================================================
# CITIZEN - APPLY
# =========================================================

@router.post(
    "/",
    response_model=ApplicationResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_application(
    payload: ApplicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_citizen),
):
    try:
        return ApplicationService.create_application(
            db=db,
            citizen_id=current_user.id,
            scheme_id=payload.scheme_id,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )


# =========================================================
# CITIZEN - MY APPLICATIONS
# =========================================================

@router.get(
    "/me",
    response_model=list[ApplicationResponse],
)
def get_my_applications(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_citizen),
):
    return ApplicationService.get_my_applications(
        db=db,
        citizen_id=current_user.id,
    )


# =========================================================
# EMPLOYEE - ALL APPLICATIONS
# =========================================================

@router.get(
    "/",
    response_model=list[ApplicationResponse],
)
def get_all_applications(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_employee),
):
    return ApplicationService.get_all_applications(db)


# =========================================================
# EMPLOYEE - UPDATE APPLICATION
# =========================================================

@router.patch(
    "/{application_id}",
    response_model=ApplicationResponse,
)
def update_application(
    application_id: int,
    payload: ApplicationStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_employee),
):
    try:
        return ApplicationService.update_application_status(
            db=db,
            application_id=application_id,
            status=payload.status,
            notes=payload.notes,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND
            if str(exc) == "Application not found."
            else status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )
