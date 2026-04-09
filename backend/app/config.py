from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql+asyncpg://nikhil@localhost:5432/manas"
    SECRET_KEY: str = "dev-secret-key"
    CORS_ORIGINS: list[str] = ["http://localhost:5173", "http://localhost:5174"]
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7

    # LLM Configuration
    LLM_PROVIDER: str = "anthropic"  # "anthropic" | "gemini" | "openai"
    ANTHROPIC_API_KEY: str = ""
    GEMINI_API_KEY: str = ""
    OPENAI_API_KEY: str = ""

    # Razorpay Configuration
    RAZORPAY_KEY_ID: str = ""
    RAZORPAY_KEY_SECRET: str = ""
    DEEP_ASSESSMENT_PRICE_PAISE: int = 39900  # ₹399 in paise

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
