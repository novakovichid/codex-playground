import os

from sqlmodel import Session, SQLModel, create_engine

from app.core.config import get_settings

settings = get_settings()
database_url = (
    settings.test_database_url
    if settings.environment == "test" or os.getenv("PYTEST_CURRENT_TEST")
    else settings.database_url
)
connect_args = {"check_same_thread": False} if database_url.startswith("sqlite") else {}
engine = create_engine(database_url, echo=False, future=True, connect_args=connect_args)

def init_db() -> None:
    SQLModel.metadata.create_all(engine)


def get_session() -> Session:
    with Session(engine) as session:
        yield session
