from datetime import datetime, timedelta
from typing import Dict

from fastapi import APIRouter, HTTPException, status
from jose import jwt
from passlib.context import CryptContext

from app.core.config import get_settings
from app.schemas.user import Message, Token, UserCreate, UserLogin, UserPublic

router = APIRouter()
password_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
settings = get_settings()

_fake_db: Dict[str, UserPublic] = {}


def _hash_password(password: str) -> str:
    return password_context.hash(password)


def _verify_password(password: str, hashed: str) -> bool:
    return password_context.verify(password, hashed)


def _create_access_token(subject: str) -> Token:
    expires_delta = timedelta(minutes=settings.access_token_expire_minutes)
    expire = datetime.utcnow() + expires_delta
    to_encode = {"sub": subject, "exp": expire}
    token = jwt.encode(to_encode, settings.secret_key, algorithm="HS256")
    return Token(access_token=token, expires_in=int(expires_delta.total_seconds()))


@router.post("/register", response_model=UserPublic, status_code=status.HTTP_201_CREATED)
def register_user(payload: UserCreate) -> UserPublic:
    if payload.email in _fake_db:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User already exists")

    hashed_password = _hash_password(payload.password)
    user = UserPublic(
        id=len(_fake_db) + 1,
        email=payload.email,
        username=payload.username,
        rating=1200,
        created_at=datetime.utcnow(),
    )
    _fake_db[payload.email] = user
    _fake_db[payload.email + "_password"] = hashed_password  # simplistic storage for demo
    return user


@router.post("/login", response_model=Token)
def login(payload: UserLogin) -> Token:
    user = _fake_db.get(payload.email)
    hashed = _fake_db.get(payload.email + "_password")
    if not user or not hashed or not _verify_password(payload.password, hashed):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    return _create_access_token(subject=str(user.id))


@router.get("/profile", response_model=Message)
def profile_hint() -> Message:
    return Message(message="Profile management will connect to the real database layer.")
