from fastapi import Depends, HTTPException, status

from app.database.dependencies import get_current_user
from app.models.user import User


def require_admin(
    current_user: User = Depends(get_current_user),
) -> User:
    """
    Allow access only to users with the admin role.
    """
    if current_user.role.lower() != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required.",
        )

    return current_user


def require_employee(
    current_user: User = Depends(get_current_user),
) -> User:
    """
    Allow access only to employees.
    """
    if current_user.role.lower() != "employee":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Employee access required.",
        )

    return current_user


def require_citizen(
    current_user: User = Depends(get_current_user),
) -> User:
    """
    Allow access only to citizens.
    """
    if current_user.role.lower() != "citizen":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Citizen access required.",
        )

    return current_user


def require_employee_or_admin(
    current_user: User = Depends(get_current_user),
) -> User:
    """
    Allow access to employees and administrators.
    """
    if current_user.role.lower() not in {"employee", "admin"}:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Employee or admin access required.",
        )

    return current_user
