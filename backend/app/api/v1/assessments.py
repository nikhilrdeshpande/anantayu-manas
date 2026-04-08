import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, Path
from pydantic import BaseModel
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db
from app.core.exceptions import BadRequestError, NotFoundError
from app.models.assessment import Answer, Assessment
from app.models.question import Question
from app.models.result import Result
from app.schemas.assessment import (
    AnswerItem,
    AnswerSubmit,
    AssessmentCreate,
    AssessmentResponse,
    Demographics,
)
from app.schemas.result import ResultResponse
from app.services.scoring_engine import ScoringEngine

router = APIRouter()


class FullAssessmentSubmit(BaseModel):
    assessment_type: str = "quick"
    locale: str = "en"
    answers: list[AnswerItem]  # [{question_id: 1, answer: "YES"}, ...]
    user_id: str | None = None  # Optional — links assessment to a user
    demographics: Demographics | None = None  # Optional pre-quiz demographics


class SaveProgressRequest(BaseModel):
    assessment_type: str = "quick"
    locale: str = "en"
    user_id: str
    current_question_index: int
    answers: list[AnswerItem]  # partial answers so far


@router.post("", response_model=AssessmentResponse)
async def create_assessment(
    body: AssessmentCreate, db: AsyncSession = Depends(get_db)
):
    assessment = Assessment(
        assessment_type=body.assessment_type,
        locale=body.locale,
        session_token=body.session_token or str(uuid.uuid4()),
    )
    db.add(assessment)
    await db.flush()
    await db.refresh(assessment)
    return assessment


@router.post("/submit", response_model=ResultResponse)
async def submit_full_assessment(
    body: FullAssessmentSubmit, db: AsyncSession = Depends(get_db)
):
    """One-shot: create assessment, save answers, compute result, return everything."""

    # 1. Create Assessment
    assessment = Assessment(
        assessment_type=body.assessment_type,
        locale=body.locale,
        session_token=str(uuid.uuid4()),
        status="completed",
        completed_at=datetime.utcnow(),
        demographics=body.demographics.model_dump() if body.demographics else None,
    )
    if body.user_id:
        assessment.user_id = uuid.UUID(body.user_id)
    db.add(assessment)
    await db.flush()
    await db.refresh(assessment)

    # 2. Save all answers
    for item in body.answers:
        answer = Answer(
            assessment_id=assessment.id,
            question_id=item.question_id,
            answer=item.answer.upper(),
        )
        db.add(answer)
    await db.flush()

    # 3. Map question_id -> section from the database
    question_ids = [item.question_id for item in body.answers]
    q_result = await db.execute(
        select(Question).where(Question.id.in_(question_ids))
    )
    questions = {q.id: q.section for q in q_result.scalars().all()}

    # Build answer dicts for the scoring engine
    answer_list = []
    for item in body.answers:
        section = questions.get(item.question_id)
        if section:
            answer_list.append({"section": section, "answer": item.answer.upper()})

    # 4. Run scoring engine
    engine = ScoringEngine()
    scoring = engine.score(answer_list, body.assessment_type)

    # 5. Create Result
    result = Result(
        assessment_id=assessment.id,
        sattva_yes=scoring.sattva_yes,
        sattva_no=scoring.sattva_no,
        sattva_sometimes=scoring.sattva_sometimes,
        rajas_yes=scoring.rajas_yes,
        rajas_no=scoring.rajas_no,
        rajas_sometimes=scoring.rajas_sometimes,
        tamas_yes=scoring.tamas_yes,
        tamas_no=scoring.tamas_no,
        tamas_sometimes=scoring.tamas_sometimes,
        sattva_primary_pct=scoring.sattva_primary_pct,
        rajas_primary_pct=scoring.rajas_primary_pct,
        tamas_primary_pct=scoring.tamas_primary_pct,
        sattva_secondary_pct=scoring.sattva_secondary_pct,
        rajas_secondary_pct=scoring.rajas_secondary_pct,
        tamas_secondary_pct=scoring.tamas_secondary_pct,
        primary_dominant_guna=scoring.primary_dominant_guna,
        secondary_dominant_guna=scoring.secondary_dominant_guna,
        prakriti_type=scoring.prakriti_type,
        prakriti_subtype=scoring.prakriti_subtype,
        archetype_title=scoring.archetype_title,
        sattva_bala=scoring.sattva_bala,
    )
    db.add(result)
    await db.flush()
    await db.refresh(result)
    return result


@router.post("/save-progress")
async def save_progress(body: SaveProgressRequest, db: AsyncSession = Depends(get_db)):
    """Save partial assessment progress for a user to resume later."""
    user_uuid = uuid.UUID(body.user_id)

    # Find existing in-progress assessment for this user, or create new
    result = await db.execute(
        select(Assessment).where(
            Assessment.user_id == user_uuid,
            Assessment.assessment_type == body.assessment_type,
            Assessment.status == "in_progress",
        ).order_by(Assessment.started_at.desc())
    )
    assessment = result.scalar_one_or_none()

    if not assessment:
        assessment = Assessment(
            user_id=user_uuid,
            assessment_type=body.assessment_type,
            locale=body.locale,
            session_token=str(uuid.uuid4()),
            status="in_progress",
        )
        db.add(assessment)
        await db.flush()
        await db.refresh(assessment)

    # Delete old answers for this assessment and re-insert
    await db.execute(
        delete(Answer).where(Answer.assessment_id == assessment.id)
    )

    for item in body.answers:
        answer = Answer(
            assessment_id=assessment.id,
            question_id=item.question_id,
            answer=item.answer.upper(),
        )
        db.add(answer)

    await db.flush()

    return {
        "assessment_id": str(assessment.id),
        "current_question_index": body.current_question_index,
        "answers_saved": len(body.answers),
    }


@router.get("/resume/{user_id}")
async def get_resume_data(user_id: str, db: AsyncSession = Depends(get_db)):
    """Get the latest in-progress assessment for a user to resume."""
    user_uuid = uuid.UUID(user_id)

    result = await db.execute(
        select(Assessment).where(
            Assessment.user_id == user_uuid,
            Assessment.status == "in_progress",
        ).order_by(Assessment.started_at.desc())
    )
    assessment = result.scalar_one_or_none()

    if not assessment:
        return {"has_progress": False}

    # Load saved answers
    answers_result = await db.execute(
        select(Answer).where(Answer.assessment_id == assessment.id)
    )
    answers = answers_result.scalars().all()

    return {
        "has_progress": True,
        "assessment_id": str(assessment.id),
        "assessment_type": assessment.assessment_type,
        "locale": assessment.locale,
        "answers": [
            {"question_id": a.question_id, "answer": a.answer}
            for a in answers
        ],
    }


@router.get("/demographics/{user_id}")
async def get_user_demographics(user_id: str, db: AsyncSession = Depends(get_db)):
    """Get demographics from the user's most recent completed assessment."""
    user_uuid = uuid.UUID(user_id)

    result = await db.execute(
        select(Assessment).where(
            Assessment.user_id == user_uuid,
            Assessment.status == "completed",
            Assessment.demographics.isnot(None),
        ).order_by(Assessment.completed_at.desc()).limit(1)
    )
    assessment = result.scalar_one_or_none()

    if not assessment or not assessment.demographics:
        return {"has_demographics": False}

    return {"has_demographics": True, "demographics": assessment.demographics}


@router.get("/history/{user_id}")
async def get_user_history(user_id: str, db: AsyncSession = Depends(get_db)):
    """Get all completed assessments for a user."""
    user_uuid = uuid.UUID(user_id)

    assessments_result = await db.execute(
        select(Assessment).where(
            Assessment.user_id == user_uuid,
            Assessment.status == "completed",
        ).order_by(Assessment.completed_at.desc())
    )
    assessments = assessments_result.scalars().all()

    history = []
    for a in assessments:
        result_row = await db.execute(
            select(Result).where(Result.assessment_id == a.id)
        )
        r = result_row.scalar_one_or_none()
        history.append({
            "assessment_id": str(a.id),
            "assessment_type": a.assessment_type,
            "completed_at": a.completed_at.isoformat() if a.completed_at else None,
            "prakriti_type": r.prakriti_type if r else None,
            "archetype_title": r.archetype_title if r else None,
            "sattva_bala": r.sattva_bala if r else None,
        })

    return {"history": history}


@router.get("/{assessment_id}", response_model=AssessmentResponse)
async def get_assessment(
    assessment_id: uuid.UUID = Path(), db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Assessment).where(Assessment.id == assessment_id)
    )
    assessment = result.scalar_one_or_none()
    if not assessment:
        raise NotFoundError("Assessment not found")
    return assessment


@router.post("/{assessment_id}/answers", response_model=AssessmentResponse)
async def submit_answers(
    body: AnswerSubmit,
    assessment_id: uuid.UUID = Path(),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Assessment).where(Assessment.id == assessment_id)
    )
    assessment = result.scalar_one_or_none()
    if not assessment:
        raise NotFoundError("Assessment not found")
    if assessment.status == "completed":
        raise BadRequestError("Assessment already completed")

    for item in body.answers:
        answer = Answer(
            assessment_id=assessment_id,
            question_id=item.question_id,
            answer=item.answer.upper(),
        )
        db.add(answer)

    assessment.status = "completed"
    assessment.completed_at = datetime.now(timezone.utc)
    await db.flush()
    await db.refresh(assessment)
    return assessment
