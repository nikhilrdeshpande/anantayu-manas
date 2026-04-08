import json
from pathlib import Path

from fastapi import APIRouter, Query

router = APIRouter()

DATA_DIR = Path(__file__).resolve().parent.parent.parent / "data"


def _load_questions(assessment_type: str, locale: str) -> list[dict]:
    filename = f"questions_{assessment_type}_{locale}.json"
    filepath = DATA_DIR / filename
    if not filepath.exists():
        # Fall back to English
        filepath = DATA_DIR / f"questions_{assessment_type}_en.json"
    if not filepath.exists():
        return []
    with open(filepath, encoding="utf-8") as f:
        return json.load(f)


@router.get("")
async def get_questions(
    type: str = Query("quick", description="Assessment type: 'quick' or 'full'"),
    locale: str = Query("en", description="Locale: 'en', 'hi', 'mr'"),
):
    questions = _load_questions(type, locale)
    return {"assessment_type": type, "locale": locale, "questions": questions}
