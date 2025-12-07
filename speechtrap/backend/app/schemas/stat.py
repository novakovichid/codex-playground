from datetime import datetime

from pydantic import BaseModel


class PlayerStatPublic(BaseModel):
    user_id: int
    games_played: int
    games_won: int
    words_guessed: int
    words_explained: int
    updated_at: datetime

    class Config:
        from_attributes = True


class PlayerStatUpdate(BaseModel):
    games_played: int
    games_won: int
    words_guessed: int
    words_explained: int
