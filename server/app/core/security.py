# server/app/core/security.py
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

# Futuramente: Lógica para criar e verificar tokens JWT
# ALGORITHM = "HS256" # Pode vir de settings
# ACCESS_TOKEN_EXPIRE_MINUTES = 30 # Pode vir de settings
