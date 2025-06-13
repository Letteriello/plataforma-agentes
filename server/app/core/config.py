from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "ai.da Platform API"
    API_V1_STR: str = "/api/v1"

    # Configurações do Supabase (exemplo, preencher via .env)
    SUPABASE_URL: str = "your_supabase_url"
    SUPABASE_KEY: str = "your_supabase_anon_key"
    SUPABASE_JWT_SECRET: str = "your_supabase_jwt_secret"

    class Config:
        env_file = ".env"
        env_file_encoding = 'utf-8'

settings = Settings()
