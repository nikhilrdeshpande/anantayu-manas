"""Seed questions from JSON files into the database.

Usage:
    python -m scripts.seed_questions
"""

import asyncio
import json
import sys
from pathlib import Path

# Ensure the project root is on sys.path so `app` is importable
PROJECT_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import async_session, engine
from app.models.question import Question

DATA_DIR = PROJECT_ROOT / "app" / "data"

FILES = [
    ("quick", "questions_quick_en.json"),
    ("full", "questions_full_en.json"),
]


async def seed_questions() -> None:
    async with async_session() as session:
        session: AsyncSession

        total_inserted = 0
        total_skipped = 0

        for assessment_type, filename in FILES:
            filepath = DATA_DIR / filename
            if not filepath.exists():
                print(f"  [SKIP] {filename} not found")
                continue

            with open(filepath, encoding="utf-8") as f:
                questions = json.load(f)

            print(f"  Processing {filename} ({len(questions)} questions)...")

            for q in questions:
                # Check for duplicate based on assessment_type + section + question_number
                existing = await session.execute(
                    select(Question).where(
                        Question.assessment_type == assessment_type,
                        Question.section == q["section"],
                        Question.question_number == q["question_number"],
                    )
                )
                if existing.scalar_one_or_none():
                    total_skipped += 1
                    continue

                question = Question(
                    assessment_type=assessment_type,
                    section=q["section"],
                    question_number=q["question_number"],
                    text_en=q["text_en"],
                    text_hi=q.get("text_hi"),
                    text_mr=q.get("text_mr"),
                    bhava_tag=q["bhava_tag"],
                    bhava_description_en=q.get("bhava_description_en"),
                )
                session.add(question)
                total_inserted += 1

        await session.commit()

    print(f"\nDone: {total_inserted} inserted, {total_skipped} skipped (duplicates)")


async def main() -> None:
    print("Seeding questions...")
    await seed_questions()
    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(main())
