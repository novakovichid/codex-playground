from sqlmodel import SQLModel, create_engine

from app.core.config import get_settings

settings = get_settings()
engine = create_engine(settings.database_url, echo=False, future=True)

def init_db() -> None:
    SQLModel.metadata.create_all(engine)
