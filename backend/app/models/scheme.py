from sqlalchemy import (
    JSON,
    Boolean,
    DateTime,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func

from app.database.base import Base


class Scheme(Base):
    __tablename__ = "schemes"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    scheme_name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        index=True,
    )

    category: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        index=True,
    )

    department: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
    )

    description: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    official_url: Mapped[str] = mapped_column(
        String(500),
        nullable=False,
    )

    income_limit: Mapped[int] = mapped_column(
        Integer,
        nullable=True,
    )

    minimum_age: Mapped[int] = mapped_column(
        Integer,
        nullable=True,
    )

    maximum_age: Mapped[int] = mapped_column(
        Integer,
        nullable=True,
    )

    requires_land: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    requires_bpl: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    disability_priority: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    target_occupations: Mapped[list] = mapped_column(
        JSON,
        default=list,
        nullable=False,
    )

    preferred_employment: Mapped[list] = mapped_column(
        JSON,
        default=list,
        nullable=False,
    )

    preferred_education: Mapped[list] = mapped_column(
        JSON,
        default=list,
        nullable=False,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    created_at: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    updated_at: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )