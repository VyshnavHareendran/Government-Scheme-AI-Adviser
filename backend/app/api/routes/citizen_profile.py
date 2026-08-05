from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.dependencies import get_db, get_current_user
from app.models.user import User
from app.schemas.citizen_profile import (
    CitizenProfileCreate,
    CitizenProfileResponse,
    CitizenProfileUpdate,
)
from app.services.citizen_profile_service import CitizenProfileService

router = APIRouter(
    prefix="/citizen-profile",
    tags=["Citizen Profile"],
)


@router.post(
    "/",
    response_model=CitizenProfileResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_profile(
    profile: CitizenProfileCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return CitizenProfileService.create_profile(
            db,
            current_user.id,
            profile,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.get(
    "/me",
    response_model=CitizenProfileResponse,
)
def get_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile = CitizenProfileService.get_profile(
        db,
        current_user.id,
    )

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Citizen profile not found.",
        )

    return profile


@router.put(
    "/me",
    response_model=CitizenProfileResponse,
)
def update_profile(
    profile: CitizenProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return CitizenProfileService.update_profile(
            db,
            current_user.id,
            profile,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )


@router.delete(
    "/me",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        CitizenProfileService.delete_profile(
            db,
            current_user.id,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )