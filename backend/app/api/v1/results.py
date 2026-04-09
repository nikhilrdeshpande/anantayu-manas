import json
import uuid
from pathlib import Path as FilePath

from fastapi import APIRouter, Depends, Path, Query
from fastapi.responses import Response, StreamingResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db, verify_deep_assessment_purchase, verify_deep_report_access
from app.core.exceptions import BadRequestError, NotFoundError, UnauthorizedError
from app.models.assessment import Answer, Assessment
from app.models.result import Result
from app.schemas.result import ResultResponse
from app.services.ai_insights import AIInsightsService
from app.services.scoring_engine import ScoringEngine

router = APIRouter()


@router.post("/{assessment_id}", response_model=ResultResponse)
async def compute_result(
    assessment_id: uuid.UUID = Path(), db: AsyncSession = Depends(get_db)
):
    # Check assessment exists and is completed
    assess_result = await db.execute(
        select(Assessment).where(Assessment.id == assessment_id)
    )
    assessment = assess_result.scalar_one_or_none()
    if not assessment:
        raise NotFoundError("Assessment not found")
    if assessment.status != "completed":
        raise BadRequestError("Assessment not yet completed")

    # Check if result already exists
    existing = await db.execute(
        select(Result).where(Result.assessment_id == assessment_id)
    )
    if existing.scalar_one_or_none():
        raise BadRequestError("Result already computed for this assessment")

    # Load answers
    answers_result = await db.execute(
        select(Answer).where(Answer.assessment_id == assessment_id)
    )
    answers = answers_result.scalars().all()

    # Load questions to map question_id -> section
    data_dir = FilePath(__file__).resolve().parent.parent.parent / "data"
    atype = "full" if assessment.assessment_type == "deep" else assessment.assessment_type
    qfile = f"questions_{atype}_en.json"
    with open(data_dir / qfile) as f:
        questions_data = json.load(f)
    question_map = {q["id"]: q for q in questions_data}

    # Build answer dicts for scoring engine (include bhava_tag for sub-type classification)
    answer_list = []
    for a in answers:
        q_data = question_map.get(a.question_id)
        if q_data:
            answer_list.append({
                "section": q_data["section"],
                "answer": a.answer,
                "bhava_tag": q_data.get("bhava_tag"),
            })

    engine = ScoringEngine()
    scoring = engine.score(answer_list, assessment.assessment_type)

    result = Result(
        assessment_id=assessment_id,
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
        subtype_key=scoring.subtype_key,
        subtype_archetype=scoring.subtype_archetype,
        subtype_animal=scoring.subtype_animal,
        bhava_scores=scoring.bhava_scores,
        sattva_bala=scoring.sattva_bala,
    )
    db.add(result)
    await db.flush()
    await db.refresh(result)
    return result


@router.get("/{assessment_id}", response_model=ResultResponse)
async def get_result(
    assessment_id: uuid.UUID = Path(), db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Result).where(Result.assessment_id == assessment_id)
    )
    r = result.scalar_one_or_none()
    if not r:
        raise NotFoundError("Result not found for this assessment")
    return r


@router.get("/{assessment_id}/subtype-profile")
async def get_subtype_profile(
    assessment_id: uuid.UUID = Path(),
    db: AsyncSession = Depends(get_db),
):
    """Get the full subtype profile data for a deep assessment result."""
    result_row = await db.execute(
        select(Result).where(Result.assessment_id == assessment_id)
    )
    r = result_row.scalar_one_or_none()
    if not r:
        raise NotFoundError("Result not found")
    if not r.subtype_key:
        return {"has_profile": False}

    data_dir = FilePath(__file__).resolve().parent.parent.parent / "data"
    with open(data_dir / "svabhava_profiles.json") as f:
        profiles_data = json.load(f)

    profile = profiles_data.get("subtype_profiles", {}).get(r.subtype_key)
    if not profile:
        return {"has_profile": False}

    return {
        "has_profile": True,
        "subtype_key": r.subtype_key,
        "profile": profile,
    }


@router.get("/{assessment_id}/insights")
async def stream_insights(
    assessment_id: uuid.UUID = Path(),
    locale: str = Query("en"),
    db: AsyncSession = Depends(get_db),
):
    """Stream AI-generated personalized insights."""
    result_row = await db.execute(
        select(Result).where(Result.assessment_id == assessment_id)
    )
    r = result_row.scalar_one_or_none()
    if not r:
        raise NotFoundError("Result not found")

    # If cached, return cached
    if r.ai_insights and locale in (r.ai_insights or {}):
        async def cached_stream():
            yield r.ai_insights[locale]
        return StreamingResponse(cached_stream(), media_type="text/plain")

    # Load demographics from the assessment for personalized insights
    assess_row = await db.execute(
        select(Assessment).where(Assessment.id == assessment_id)
    )
    assessment = assess_row.scalar_one_or_none()
    demographics = assessment.demographics if assessment else None

    service = AIInsightsService()

    collected_text = []

    async def insight_stream():
        async for chunk in service.generate_insights_stream(
            prakriti_type=r.prakriti_type,
            primary_guna=r.primary_dominant_guna,
            secondary_guna=r.secondary_dominant_guna,
            sattva_pct=float(r.sattva_secondary_pct),
            rajas_pct=float(r.rajas_secondary_pct),
            tamas_pct=float(r.tamas_secondary_pct),
            sattva_bala=r.sattva_bala,
            locale=locale,
            demographics=demographics,
        ):
            collected_text.append(chunk)
            yield chunk

        # Cache the full text after streaming completes
        # (fire and forget - don't block the stream)

    return StreamingResponse(insight_stream(), media_type="text/plain")


@router.get("/{assessment_id}/deep-insights")
async def stream_deep_insights(
    assessment_id: uuid.UUID = Path(),
    user_id: str = Query(...),
    locale: str = Query("en"),
    db: AsyncSession = Depends(get_db),
):
    """Stream comprehensive premium report. Requires completed purchase."""
    user_uuid = uuid.UUID(user_id)

    # Verify purchase  - either an unused purchase OR a purchase linked to this assessment
    has_unused = await verify_deep_assessment_purchase(user_uuid, db)
    has_report = await verify_deep_report_access(user_uuid, assessment_id, db)
    if not has_unused and not has_report:
        raise UnauthorizedError("Purchase required to access deep insights")

    # Load result
    result_row = await db.execute(
        select(Result).where(Result.assessment_id == assessment_id)
    )
    r = result_row.scalar_one_or_none()
    if not r:
        raise NotFoundError("Result not found")

    # Check cache
    cache_key = f"deep_{locale}"
    if r.ai_insights and cache_key in (r.ai_insights or {}):
        async def cached_stream():
            yield r.ai_insights[cache_key]
        return StreamingResponse(cached_stream(), media_type="text/plain")

    # Load demographics
    assess_row = await db.execute(
        select(Assessment).where(Assessment.id == assessment_id)
    )
    assessment = assess_row.scalar_one_or_none()
    demographics = assessment.demographics if assessment else None

    # Load subtype profile from data file
    subtype_profile = None
    if r.subtype_key:
        data_dir = FilePath(__file__).resolve().parent.parent.parent / "data"
        with open(data_dir / "svabhava_profiles.json") as f:
            profiles_data = json.load(f)
        subtype_profile = profiles_data.get("subtype_profiles", {}).get(r.subtype_key)

    service = AIInsightsService()
    collected_text = []

    async def deep_stream():
        async for chunk in service.generate_deep_report_stream(
            prakriti_type=r.prakriti_type,
            subtype_key=r.subtype_key,
            subtype_name=r.prakriti_subtype,
            subtype_archetype=r.subtype_archetype,
            subtype_animal=r.subtype_animal,
            primary_guna=r.primary_dominant_guna,
            secondary_guna=r.secondary_dominant_guna,
            sattva_pct=float(r.sattva_secondary_pct),
            rajas_pct=float(r.rajas_secondary_pct),
            tamas_pct=float(r.tamas_secondary_pct),
            sattva_bala=r.sattva_bala,
            bhava_scores=r.bhava_scores,
            demographics=demographics,
            subtype_profile=subtype_profile,
            locale=locale,
        ):
            collected_text.append(chunk)
            yield chunk

        # Cache after streaming completes
        full_text = "".join(collected_text)
        if full_text:
            current_insights = r.ai_insights or {}
            current_insights[cache_key] = full_text
            r.ai_insights = current_insights
            await db.commit()

    return StreamingResponse(deep_stream(), media_type="text/plain")


@router.get("/{assessment_id}/pdf")
async def download_quick_pdf(
    assessment_id: uuid.UUID = Path(),
    db: AsyncSession = Depends(get_db),
):
    """Download PDF report for quick assessment."""
    from app.services.pdf_generator import generate_quick_report_pdf

    result_row = await db.execute(
        select(Result).where(Result.assessment_id == assessment_id)
    )
    r = result_row.scalar_one_or_none()
    if not r:
        raise NotFoundError("Result not found")

    # Load prakriti data for the report
    data_dir = FilePath(__file__).resolve().parent.parent.parent / "data"
    prakriti_data = None
    try:
        with open(data_dir / "prakriti_types.json") as f:
            all_types = json.load(f)
        key = r.prakriti_type.lower().replace(" ", "-").replace("_", "-")
        prakriti_data = all_types.get(key)
    except Exception:
        pass

    result_dict = {
        "prakriti_type": r.prakriti_type,
        "archetype_title": r.archetype_title,
        "sattva_yes": r.sattva_yes, "sattva_no": r.sattva_no, "sattva_sometimes": r.sattva_sometimes,
        "rajas_yes": r.rajas_yes, "rajas_no": r.rajas_no, "rajas_sometimes": r.rajas_sometimes,
        "tamas_yes": r.tamas_yes, "tamas_no": r.tamas_no, "tamas_sometimes": r.tamas_sometimes,
        "sattva_primary_pct": r.sattva_primary_pct, "rajas_primary_pct": r.rajas_primary_pct, "tamas_primary_pct": r.tamas_primary_pct,
        "sattva_secondary_pct": r.sattva_secondary_pct, "rajas_secondary_pct": r.rajas_secondary_pct, "tamas_secondary_pct": r.tamas_secondary_pct,
        "sattva_bala": r.sattva_bala,
    }

    pdf_bytes = generate_quick_report_pdf(result_dict, prakriti_data)
    filename = f"manas-prakriti-{r.prakriti_type.lower().replace(' ', '-')}.pdf"
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


@router.get("/{assessment_id}/deep-pdf")
async def download_deep_pdf(
    assessment_id: uuid.UUID = Path(),
    user_id: str = Query(...),
    db: AsyncSession = Depends(get_db),
):
    """Download PDF for deep assessment. Requires purchase."""
    from app.services.pdf_generator import generate_deep_report_pdf

    user_uuid = uuid.UUID(user_id)
    has_unused = await verify_deep_assessment_purchase(user_uuid, db)
    has_report = await verify_deep_report_access(user_uuid, assessment_id, db)
    if not has_unused and not has_report:
        raise UnauthorizedError("Purchase required")

    result_row = await db.execute(
        select(Result).where(Result.assessment_id == assessment_id)
    )
    r = result_row.scalar_one_or_none()
    if not r:
        raise NotFoundError("Result not found")

    # Get the cached deep report JSON
    report_data = {}
    cache_key = "deep_en"
    if r.ai_insights and cache_key in r.ai_insights:
        raw = r.ai_insights[cache_key]
        # Extract JSON (same logic as frontend)
        import re
        fence_match = re.search(r'```(?:json)?\s*\n?([\s\S]*?)\n?\s*```', raw)
        text = fence_match.group(1).strip() if fence_match else raw.strip()
        try:
            report_data = json.loads(text)
        except Exception:
            first_brace = text.find('{')
            last_brace = text.rfind('}')
            if first_brace != -1 and last_brace > first_brace:
                try:
                    report_data = json.loads(text[first_brace:last_brace + 1])
                except Exception:
                    pass

    # Load demographics
    assess_row = await db.execute(
        select(Assessment).where(Assessment.id == assessment_id)
    )
    assessment = assess_row.scalar_one_or_none()
    demographics = assessment.demographics if assessment else None

    result_dict = {
        "prakriti_type": r.prakriti_type,
        "prakriti_subtype": r.prakriti_subtype,
        "archetype_title": r.archetype_title,
        "subtype_archetype": r.subtype_archetype,
        "subtype_animal": r.subtype_animal,
        "sattva_secondary_pct": r.sattva_secondary_pct,
        "rajas_secondary_pct": r.rajas_secondary_pct,
        "tamas_secondary_pct": r.tamas_secondary_pct,
        "sattva_bala": r.sattva_bala,
    }

    pdf_bytes = generate_deep_report_pdf(result_dict, report_data, demographics)
    subtype = (r.prakriti_subtype or r.prakriti_type).lower().replace(" ", "-")
    filename = f"manas-deep-report-{subtype}.pdf"
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )
