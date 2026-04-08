import uuid
from datetime import datetime
from decimal import Decimal
from typing import Any

from pydantic import BaseModel


class ResultResponse(BaseModel):
    id: uuid.UUID
    assessment_id: uuid.UUID

    sattva_yes: int
    sattva_no: int
    sattva_sometimes: int
    rajas_yes: int
    rajas_no: int
    rajas_sometimes: int
    tamas_yes: int
    tamas_no: int
    tamas_sometimes: int

    sattva_primary_pct: Decimal
    rajas_primary_pct: Decimal
    tamas_primary_pct: Decimal

    sattva_secondary_pct: Decimal
    rajas_secondary_pct: Decimal
    tamas_secondary_pct: Decimal

    primary_dominant_guna: str
    secondary_dominant_guna: str | None = None
    prakriti_type: str
    prakriti_subtype: str | None = None
    archetype_title: str | None = None
    sattva_bala: str

    ai_insights: dict[str, Any] | None = None
    created_at: datetime

    model_config = {"from_attributes": True}
