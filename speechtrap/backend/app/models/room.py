from datetime import datetime
from typing import Optional

from sqlmodel import Field, SQLModel


class Room(SQLModel, table=True):
    __tablename__ = "rooms"

    id: Optional[int] = Field(default=None, primary_key=True)
    code: str = Field(index=True, unique=True)
    host_id: int = Field(foreign_key="users.id")
    difficulty: str = Field(default="base")
    round_time: int = Field(default=60)
    rounds: int = Field(default=5)
    created_at: datetime = Field(default_factory=datetime.utcnow)
