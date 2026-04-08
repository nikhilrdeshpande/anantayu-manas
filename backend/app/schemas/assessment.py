import uuid
from datetime import datetime

from pydantic import BaseModel


class Demographics(BaseModel):
    age: int  # actual age, not range
    gender: str  # "male" | "female"
    diet: str  # "vegetarian" | "non_vegetarian" | "vegan"
    work_nature: str  # "desk" | "physical" | "creative" | "mixed"
    sleep_quality: str  # "good" | "average" | "poor"


class AssessmentCreate(BaseModel):
    assessment_type: str = "quick"  # 'quick' or 'full'
    locale: str = "en"
    session_token: str | None = None


class AnswerItem(BaseModel):
    question_id: int
    answer: str  # 'YES', 'NO', 'SOMETIMES'


class AnswerSubmit(BaseModel):
    answers: list[AnswerItem]


class AnswerResponse(BaseModel):
    question_id: int
    answer: str

    model_config = {"from_attributes": True}


class AssessmentResponse(BaseModel):
    id: uuid.UUID
    assessment_type: str
    locale: str
    status: str
    started_at: datetime
    completed_at: datetime | None = None

    model_config = {"from_attributes": True}
