from datetime import datetime
from typing import Optional

from sqlmodel import Field, SQLModel


class PlayerStat(SQLModel, table=True):
    __tablename__ = "player_stats"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id", index=True)
    games_played: int = Field(default=0)
    games_won: int = Field(default=0)
    words_guessed: int = Field(default=0)
    words_explained: int = Field(default=0)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
