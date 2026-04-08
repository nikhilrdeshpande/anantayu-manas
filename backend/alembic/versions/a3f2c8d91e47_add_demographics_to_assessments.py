"""add demographics to assessments

Revision ID: a3f2c8d91e47
Revises: beabfff9ced4
Create Date: 2026-03-25 20:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'a3f2c8d91e47'
down_revision: Union[str, None] = 'beabfff9ced4'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('assessments', sa.Column('demographics', postgresql.JSON(astext_type=sa.Text()), nullable=True))


def downgrade() -> None:
    op.drop_column('assessments', 'demographics')
