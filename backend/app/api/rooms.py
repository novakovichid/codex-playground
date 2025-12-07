import random
import string
from typing import Dict

from fastapi import APIRouter, HTTPException, status
from datetime import datetime

from app.schemas.room import RoomCreate, RoomPublic

router = APIRouter()
_rooms: Dict[str, RoomPublic] = {}


def _generate_code(length: int = 6) -> str:
    return "".join(random.choices(string.ascii_uppercase + string.digits, k=length))


@router.post("/", response_model=RoomPublic, status_code=status.HTTP_201_CREATED)
def create_room(payload: RoomCreate, user_id: int = 1) -> RoomPublic:
    code = _generate_code()
    room = RoomPublic(
        id=len(_rooms) + 1,
        code=code,
        host_id=user_id,
        difficulty=payload.difficulty,
        round_time=payload.round_time,
        rounds=payload.rounds,
        created_at=datetime.utcnow(),
    )
    _rooms[code] = room
    return room


@router.get("/{code}", response_model=RoomPublic)
def get_room(code: str) -> RoomPublic:
    room = _rooms.get(code)
    if not room:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Room not found")
    return room
