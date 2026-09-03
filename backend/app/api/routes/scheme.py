from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.repositories.scheme_repository import SchemeRepository
from app.core.permissions import require_admin
from app.schemas.scheme import (
    SchemeCreate,
    SchemeResponse,
    SchemeUpdate,
)
from app.services.scheme_service import SchemeService

router = APIRouter(
    prefix="/schemes",
    tags=["Schemes"],
)


def get_scheme_service(
    db: Session = Depends(get_db),
) -> SchemeService:
    repository = SchemeRepository(db)
    return SchemeService(repository)


# ---------------------------------------------------------
# GET ALL SCHEMES
# ---------------------------------------------------------
@router.get(
    "/",
    response_model=list[SchemeResponse],
)
def get_schemes(
    service: SchemeService = Depends(get_scheme_service),
):
    return service.get_all_schemes()


# ---------------------------------------------------------
# CREATE SCHEME - ADMIN ONLY
# ---------------------------------------------------------
@router.post(
    "/",
    response_model=SchemeResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_scheme(
    scheme: SchemeCreate,
    service: SchemeService = Depends(get_scheme_service),
    current_user=Depends(require_admin),
):
    return service.create_scheme(scheme)


# ---------------------------------------------------------
# GET SINGLE SCHEME
# ---------------------------------------------------------
@router.get(
    "/{scheme_id}",
    response_model=SchemeResponse,
)
def get_scheme(
    scheme_id: int,
    service: SchemeService = Depends(get_scheme_service),
):
    scheme = service.get_scheme(scheme_id)

    if not scheme:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scheme not found",
        )

    return scheme


# ---------------------------------------------------------
# UPDATE SCHEME - ADMIN ONLY
# ---------------------------------------------------------
@router.put(
    "/{scheme_id}",
    response_model=SchemeResponse,
)
def update_scheme(
    scheme_id: int,
    scheme: SchemeUpdate,
    service: SchemeService = Depends(get_scheme_service),
    current_user=Depends(require_admin),
):
    updated = service.update_scheme(scheme_id, scheme)

    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scheme not found",
        )

    return updated


# ---------------------------------------------------------
# DELETE SCHEME - ADMIN ONLY
# ---------------------------------------------------------
@router.delete(
    "/{scheme_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_scheme(
    scheme_id: int,
    service: SchemeService = Depends(get_scheme_service),
    current_user=Depends(require_admin),
):
    deleted = service.delete_scheme(scheme_id)

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scheme not found",
        )