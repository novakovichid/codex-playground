from functools import lru_cache
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "SpeechTrap API"
    environment: str = "development"
    secret_key: str = "change-me"
    database_url: str = "postgresql+psycopg2://speechtrap:speechtrap@db:5432/speechtrap"
    test_database_url: str = "postgresql+psycopg2://speechtrap_test:speechtrap@db:5432/speechtrap_test"
    access_token_expire_minutes: int = 60

    class Config:
        env_file = ".env"


@lru_cache
def get_settings() -> Settings:
    return Settings()
