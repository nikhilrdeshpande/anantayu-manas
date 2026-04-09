"""Add purchases table and subtype fields to results

Revision ID: c5e8f1a23b90
Revises: a3f2c8d91e47
Create Date: 2026-04-08

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = "c5e8f1a23b90"
down_revision: Union[str, None] = "a3f2c8d91e47"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create purchases table
    op.create_table(
        "purchases",
        sa.Column("id", sa.Uuid(), nullable=False, server_default=sa.text("gen_random_uuid()")),
        sa.Column("user_id", sa.Uuid(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("assessment_id", sa.Uuid(), sa.ForeignKey("assessments.id"), nullable=True),
        sa.Column("product", sa.String(50), nullable=False),
        sa.Column("amount", sa.Integer(), nullable=False),
        sa.Column("currency", sa.String(5), nullable=False, server_default="INR"),
        sa.Column("razorpay_order_id", sa.String(100), nullable=False),
        sa.Column("razorpay_payment_id", sa.String(100), nullable=True),
        sa.Column("razorpay_signature", sa.String(255), nullable=True),
        sa.Column("status", sa.String(20), nullable=False, server_default="pending"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_purchases_user_id", "purchases", ["user_id"])
    op.create_index("ix_purchases_razorpay_order_id", "purchases", ["razorpay_order_id"])

    # Add subtype fields to results table
    op.add_column("results", sa.Column("subtype_key", sa.String(50), nullable=True))
    op.add_column("results", sa.Column("subtype_archetype", sa.String(100), nullable=True))
    op.add_column("results", sa.Column("subtype_animal", sa.String(100), nullable=True))
    op.add_column("results", sa.Column("bhava_scores", postgresql.JSON(), nullable=True))


def downgrade() -> None:
    op.drop_column("results", "bhava_scores")
    op.drop_column("results", "subtype_animal")
    op.drop_column("results", "subtype_archetype")
    op.drop_column("results", "subtype_key")
    op.drop_index("ix_purchases_razorpay_order_id", table_name="purchases")
    op.drop_index("ix_purchases_user_id", table_name="purchases")
    op.drop_table("purchases")
