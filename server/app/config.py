import os
from dotenv import load_dotenv
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

# Load .env file from the server directory (server/.env)
dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env') 
load_dotenv(dotenv_path=dotenv_path)

class Settings(BaseSettings):
    # Supabase
    SUPABASE_URL: str = ""
    SUPABASE_KEY: str = "" # This is typically the anon key for client-side
    SUPABASE_SERVICE_KEY: str = "" # Service role key for backend admin tasks

    # JWT
    SECRET_KEY: str = "change-this-super-secret-key-for-jwt" # IMPORTANT: Change this in .env
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 # e.g., 24 hours

    # Vertex AI
    VERTEX_AI_PROJECT_ID: Optional[str] = None
    VERTEX_AI_LOCATION: Optional[str] = None
    # GOOGLE_APPLICATION_CREDENTIALS path is usually set as an environment variable directly
    # and used by the Google client libraries automatically.

    # Encryption
    ENCRYPTION_KEY_FILE: str = os.path.join(os.path.dirname(__file__), '..', '..', 'secret.key')

    model_config = SettingsConfigDict(env_file=dotenv_path, extra='ignore', case_sensitive=False)

settings = Settings()

# --- Existing encryption logic ---
from cryptography.fernet import Fernet

def get_key():
    if not os.path.exists(settings.ENCRYPTION_KEY_FILE):
        _key = Fernet.generate_key()
        with open(settings.ENCRYPTION_KEY_FILE, "wb") as key_file:
            key_file.write(_key)
        return _key
    return open(settings.ENCRYPTION_KEY_FILE, "rb").read()

_encryption_key = get_key()
fernet = Fernet(_encryption_key)

def encrypt_value(value: str) -> bytes:
    return fernet.encrypt(value.encode())

def decrypt_value(encrypted_value: bytes) -> str:
    return fernet.decrypt(encrypted_value).decode()
