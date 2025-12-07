from fastapi import APIRouter

from app.schemas.user import Message

router = APIRouter()


@router.get("/", response_model=Message)
def healthcheck() -> Message:
    return Message(message="ok")
