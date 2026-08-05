from sqlalchemy import (
    Boolean,
    Date,
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    Numeric,
    String,
)
from decimal import Decimal
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.database.base import Base
from app.models.enums import (
    Category,
    EducationLevel,
    EmploymentStatus,
    Gender,
    MaritalStatus,
)


class CitizenProfile(Base):
    __tablename__ = "citizen_profiles"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True,
    )

    date_of_birth: Mapped[Date] = mapped_column(
        Date,
        nullable=False,
    )

    gender: Mapped[Gender] = mapped_column(
        Enum(
            Gender,
            values_callable=lambda enum: [e.value for e in enum],
        ),
        nullable=False,
    )

    state: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    district: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    pincode: Mapped[str] = mapped_column(
        String(10),
        nullable=False,
    )

    education_level: Mapped[EducationLevel] = mapped_column(
        Enum(
            EducationLevel,
            values_callable=lambda enum: [e.value for e in enum],
        ),
        nullable=False,
    )

    employment_status: Mapped[EmploymentStatus] = mapped_column(
        Enum(
            EmploymentStatus,
            values_callable=lambda enum: [e.value for e in enum],
        ),
        nullable=False,
    )

    occupation: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    annual_income: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        nullable=False,
    )

    bpl_card: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    category: Mapped[Category] = mapped_column(
        Enum(
            Category,
            values_callable=lambda enum: [e.value for e in enum],
        ),
        nullable=False,
    )

    disability_status: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    marital_status: Mapped[MaritalStatus] = mapped_column(
        Enum(
            MaritalStatus,
            values_callable=lambda enum: [e.value for e in enum],
        ),
        nullable=False,
    )

    land_holding: Mapped[Decimal] = mapped_column(
        Numeric(8, 2),
        default=0,
        nullable=False,
    )

    family_size: Mapped[int] = mapped_column(
        Integer,
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

    user = relationship(
        "User",
        back_populates="citizen_profile",
    )