from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.permissions import require_admin
from app.database.dependencies import get_db
from app.models.user import User
from app.schemas.admin_citizen import (
    AdminCitizenDetail,
    AdminCitizenListItem,
)
from app.services.admin_citizen_service import AdminCitizenService


router = APIRouter(
    prefix="/admin/citizens",
    tags=["Admin Citizens"],
)


@router.get(
    "/",
    response_model=list[AdminCitizenListItem],
)
def get_admin_citizens(
    search: str | None = Query(
        default=None,
        description="Search by citizen name or email.",
    ),
    status_filter: str = Query(
        default="all",
        alias="status",
        pattern="^(all|active|inactive)$",
    ),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    citizens = AdminCitizenService.get_citizens(
        db=db,
        search=search,
        status_filter=status_filter,
    )

    return [
        AdminCitizenListItem(
            id=citizen.id,
            full_name=citizen.full_name,
            email=citizen.email,
            role=citizen.role,
            is_active=citizen.is_active,
            created_at=citizen.created_at,
            has_profile=citizen.citizen_profile is not None,
            profile_completion=(
                100
                if citizen.citizen_profile is not None
                else 0
            ),
        )
        for citizen in citizens
    ]


@router.get(
    "/{citizen_id}",
    response_model=AdminCitizenDetail,
)
def get_admin_citizen(
    citizen_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    citizen = AdminCitizenService.get_citizen(
        db=db,
        citizen_id=citizen_id,
    )

    if not citizen:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Citizen not found.",
        )

    return AdminCitizenDetail(
        id=citizen.id,
        full_name=citizen.full_name,
        email=citizen.email,
        role=citizen.role,
        is_active=citizen.is_active,
        created_at=citizen.created_at,
        updated_at=citizen.updated_at,
        profile=citizen.citizen_profile,
    )