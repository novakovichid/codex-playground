from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel
from sqlmodel import Session, select

from app.core.config import get_settings
from app.db.session import get_session
from app.models.stat import PlayerStat
from app.models.user import User
from app.schemas.user import Token, UserCreate, UserLogin, UserPublic

router = APIRouter()
password_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")
settings = get_settings()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


class TokenPayload(BaseModel):
    sub: str
    exp: int


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


def _get_user_by_email(session: Session, email: str) -> User | None:
    statement = select(User).where(User.email == email)
    return session.exec(statement).first()


def _get_user_by_username(session: Session, username: str) -> User | None:
    statement = select(User).where(User.username == username)
    return session.exec(statement).first()


def get_current_user(token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=["HS256"])
        token_data = TokenPayload(**payload)
    except (JWTError, ValueError):
        raise credentials_exception

    user = session.get(User, int(token_data.sub)) if token_data.sub else None
    if user is None:
        raise credentials_exception
    return user


@router.post("/register", response_model=UserPublic, status_code=status.HTTP_201_CREATED)
def register_user(payload: UserCreate, session: Session = Depends(get_session)) -> UserPublic:
    if _get_user_by_email(session, payload.email) or _get_user_by_username(session, payload.username):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User already exists")

    user = User(
        email=payload.email,
        username=payload.username,
        hashed_password=_hash_password(payload.password),
    )
    session.add(user)
    session.commit()
    session.refresh(user)

    # Create initial stats so UI can render something meaningful
    stat = PlayerStat(user_id=user.id)
    session.add(stat)
    session.commit()

    return user


@router.post("/login", response_model=Token)
def login(payload: UserLogin, session: Session = Depends(get_session)) -> Token:
    user = _get_user_by_email(session, payload.email)
    if not user or not _verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    return _create_access_token(subject=str(user.id))


@router.get("/me", response_model=UserPublic)
def get_profile(current_user: User = Depends(get_current_user)) -> User:
    return current_user
