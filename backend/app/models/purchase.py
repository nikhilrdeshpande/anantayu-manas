import uuid
from datetime import datetime

from sqlalchemy import ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Purchase(Base):
    __tablename__ = "purchases"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"))
    assessment_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("assessments.id"), nullable=True
    )

    product: Mapped[str] = mapped_column(String(50))  # "deep_assessment"
    amount: Mapped[int] = mapped_column(Integer)  # in paise (39900 = ₹399)
    currency: Mapped[str] = mapped_column(String(5), default="INR")

    # Razorpay fields
    razorpay_order_id: Mapped[str] = mapped_column(String(100))
    razorpay_payment_id: Mapped[str | None] = mapped_column(
        String(100), nullable=True
    )
    razorpay_signature: Mapped[str | None] = mapped_column(
        String(255), nullable=True
    )

    status: Mapped[str] = mapped_column(
        String(20), default="pending"
    )  # pending, completed, failed, refunded

    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        server_default=func.now(), onupdate=func.now()
    )
