import random
import string

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from app.api.auth import get_current_user
from app.db.session import get_session
from app.models.room import Room
from app.models.user import User
from app.schemas.room import RoomCreate, RoomPublic

router = APIRouter()


def _generate_code(length: int = 6) -> str:
    return "".join(random.choices(string.ascii_uppercase + string.digits, k=length))


def _generate_unique_code(session: Session) -> str:
    while True:
        code = _generate_code()
        exists = session.exec(select(Room).where(Room.code == code)).first()
        if not exists:
            return code


@router.post("/", response_model=RoomPublic, status_code=status.HTTP_201_CREATED)
def create_room(
    payload: RoomCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
) -> RoomPublic:
    code = _generate_unique_code(session)
    room = Room(
        code=code,
        host_id=current_user.id,
        difficulty=payload.difficulty,
        round_time=payload.round_time,
        rounds=payload.rounds,
    )
    session.add(room)
    session.commit()
    session.refresh(room)
    return room


@router.get("/{code}", response_model=RoomPublic)
def get_room(code: str, session: Session = Depends(get_session)) -> RoomPublic:
    statement = select(Room).where(Room.code == code)
    room = session.exec(statement).first()
    if not room:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Room not found")
    return room
