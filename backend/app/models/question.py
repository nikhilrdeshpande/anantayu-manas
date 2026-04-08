from sqlalchemy import String, Integer, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Question(Base):
    __tablename__ = "questions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    assessment_type: Mapped[str] = mapped_column(String(20))  # 'quick' or 'full'
    section: Mapped[str] = mapped_column(String(20))  # 'sattva', 'rajas', 'tamas'
    question_number: Mapped[int] = mapped_column(Integer)
    text_en: Mapped[str] = mapped_column(Text)
    text_hi: Mapped[str | None] = mapped_column(Text, nullable=True)
    text_mr: Mapped[str | None] = mapped_column(Text, nullable=True)
    bhava_tag: Mapped[str] = mapped_column(String(50))
    bhava_description_en: Mapped[str | None] = mapped_column(String(255), nullable=True)
