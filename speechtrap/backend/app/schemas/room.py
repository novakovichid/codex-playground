from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class RoomCreate(BaseModel):
    difficulty: str = Field(default="base")
    round_time: int = Field(default=60, ge=30, le=180)
    rounds: int = Field(default=5, ge=1, le=10)


class RoomPublic(BaseModel):
    id: int
    code: str
    host_id: int
    difficulty: str
    round_time: int
    rounds: int
    created_at: datetime

    class Config:
        from_attributes = True
