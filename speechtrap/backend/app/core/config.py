from functools import lru_cache
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "SpeechTrap API"
    environment: str = "development"
    secret_key: str = "change-me"
    database_url: str = "sqlite:///./speechtrap.db"
    test_database_url: str = "sqlite:///./speechtrap_test.db"
    access_token_expire_minutes: int = 60

    class Config:
        env_file = ".env"


@lru_cache
def get_settings() -> Settings:
    return Settings()
