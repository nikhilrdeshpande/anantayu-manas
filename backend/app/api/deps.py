import uuid
from collections.abc import AsyncGenerator

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import async_session


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with async_session() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise


async def verify_deep_assessment_purchase(
    user_id: uuid.UUID, db: AsyncSession
) -> bool:
    """Check if user has an unused deep_assessment purchase (paid but not yet submitted)."""
    from app.models.purchase import Purchase

    result = await db.execute(
        select(Purchase).where(
            Purchase.user_id == user_id,
            Purchase.product == "deep_assessment",
            Purchase.status == "completed",
            Purchase.assessment_id.is_(None),  # not yet used
        )
    )
    return result.scalar_one_or_none() is not None


async def verify_deep_report_access(
    user_id: uuid.UUID, assessment_id: uuid.UUID, db: AsyncSession
) -> bool:
    """Check if user has a purchase linked to this specific assessment (for viewing reports)."""
    from app.models.purchase import Purchase

    result = await db.execute(
        select(Purchase).where(
            Purchase.user_id == user_id,
            Purchase.product == "deep_assessment",
            Purchase.status == "completed",
            Purchase.assessment_id == assessment_id,
        )
    )
    return result.scalar_one_or_none() is not None
