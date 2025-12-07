from typing import Dict

from fastapi import APIRouter, HTTPException

from app.schemas.stat import PlayerStatPublic

router = APIRouter()
_stats: Dict[int, PlayerStatPublic] = {}


@router.get("/{user_id}", response_model=PlayerStatPublic)
def get_player_stats(user_id: int) -> PlayerStatPublic:
    stat = _stats.get(user_id)
    if not stat:
        raise HTTPException(status_code=404, detail="Statistics not found yet")
    return stat


@router.post("/{user_id}", response_model=PlayerStatPublic)
def update_player_stats(user_id: int, payload: PlayerStatPublic) -> PlayerStatPublic:
    _stats[user_id] = payload
    return payload
