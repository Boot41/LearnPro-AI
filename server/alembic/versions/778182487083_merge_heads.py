"""merge heads

Revision ID: 778182487083
Revises: 1c83ff5440f3, 52a6a43734de
Create Date: 2025-03-14 16:07:45.711529

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '778182487083'
down_revision: Union[str, None] = ('1c83ff5440f3', '52a6a43734de')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
