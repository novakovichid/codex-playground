from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from app.db.session import get_session
from app.models.stat import PlayerStat
from app.schemas.stat import PlayerStatPublic, PlayerStatUpdate

router = APIRouter()


def _get_stat(session: Session, user_id: int) -> PlayerStat | None:
    return session.exec(select(PlayerStat).where(PlayerStat.user_id == user_id)).first()


@router.get("/{user_id}", response_model=PlayerStatPublic)
def get_player_stats(user_id: int, session: Session = Depends(get_session)) -> PlayerStatPublic:
    stat = _get_stat(session, user_id)
    if not stat:
        raise HTTPException(status_code=404, detail="Statistics not found yet")
    return stat


@router.post("/{user_id}", response_model=PlayerStatPublic)
def update_player_stats(
    user_id: int, payload: PlayerStatUpdate, session: Session = Depends(get_session)
) -> PlayerStatPublic:
    stat = _get_stat(session, user_id)
    if not stat:
        stat = PlayerStat(user_id=user_id)

    stat.games_played = payload.games_played
    stat.games_won = payload.games_won
    stat.words_guessed = payload.words_guessed
    stat.words_explained = payload.words_explained
    stat.updated_at = datetime.utcnow()

    session.add(stat)
    session.commit()
    session.refresh(stat)
    return stat
