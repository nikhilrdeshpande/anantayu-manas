import uuid
from datetime import datetime
from decimal import Decimal

from sqlalchemy import ForeignKey, Integer, Numeric, String, Text, func
from sqlalchemy.dialects.postgresql import JSON
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Result(Base):
    __tablename__ = "results"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    assessment_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("assessments.id"), unique=True
    )

    # Raw counts
    sattva_yes: Mapped[int] = mapped_column(Integer, default=0)
    sattva_no: Mapped[int] = mapped_column(Integer, default=0)
    sattva_sometimes: Mapped[int] = mapped_column(Integer, default=0)
    rajas_yes: Mapped[int] = mapped_column(Integer, default=0)
    rajas_no: Mapped[int] = mapped_column(Integer, default=0)
    rajas_sometimes: Mapped[int] = mapped_column(Integer, default=0)
    tamas_yes: Mapped[int] = mapped_column(Integer, default=0)
    tamas_no: Mapped[int] = mapped_column(Integer, default=0)
    tamas_sometimes: Mapped[int] = mapped_column(Integer, default=0)

    # Primary percentages (before SOMETIMES conversion)
    sattva_primary_pct: Mapped[Decimal] = mapped_column(Numeric(5, 2), default=0)
    rajas_primary_pct: Mapped[Decimal] = mapped_column(Numeric(5, 2), default=0)
    tamas_primary_pct: Mapped[Decimal] = mapped_column(Numeric(5, 2), default=0)

    # Secondary percentages (after SOMETIMES conversion)
    sattva_secondary_pct: Mapped[Decimal] = mapped_column(Numeric(5, 2), default=0)
    rajas_secondary_pct: Mapped[Decimal] = mapped_column(Numeric(5, 2), default=0)
    tamas_secondary_pct: Mapped[Decimal] = mapped_column(Numeric(5, 2), default=0)

    # Classification
    primary_dominant_guna: Mapped[str] = mapped_column(String(20))
    secondary_dominant_guna: Mapped[str | None] = mapped_column(
        String(20), nullable=True
    )
    prakriti_type: Mapped[str] = mapped_column(String(50))
    prakriti_subtype: Mapped[str | None] = mapped_column(String(50), nullable=True)
    archetype_title: Mapped[str | None] = mapped_column(String(100), nullable=True)
    sattva_bala: Mapped[str] = mapped_column(String(20))  # pravara/madhya/avara

    # Sub-type fields (populated for deep/full assessments)
    subtype_key: Mapped[str | None] = mapped_column(String(50), nullable=True)
    subtype_archetype: Mapped[str | None] = mapped_column(String(100), nullable=True)
    subtype_animal: Mapped[str | None] = mapped_column(String(100), nullable=True)
    bhava_scores: Mapped[dict | None] = mapped_column(JSON, nullable=True)

    # AI-generated insights
    ai_insights: Mapped[dict | None] = mapped_column(JSON, nullable=True)

    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
