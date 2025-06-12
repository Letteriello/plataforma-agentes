import os
from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables from .env file in the project root
# Assumes security.py is in server/app/
dotenv_path = os.path.join(os.path.dirname(__file__), '..', '..', '.env')
load_dotenv(dotenv_path=dotenv_path)

# Configuration
SECRET_KEY = os.environ.get("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.environ.get("ACCESS_TOKEN_EXPIRE_MINUTES", 30))

if not SECRET_KEY:
    raise EnvironmentError(f"SECRET_KEY environment variable not set. Please generate one and add to {dotenv_path}")

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 scheme
# tokenUrl should point to your actual token endpoint, e.g., "auth/login" or "token"
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token") # Adjusted tokenUrl

class TokenData(BaseModel):
    user_id: Optional[str] = None

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies a plain password against a hashed password."""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Hashes a plain password."""
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Creates a new JWT access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user_id(token: str = Depends(oauth2_scheme)) -> str:
    """
    Decodes the JWT token, validates it, and extracts the user_id.
    This function can be used as a dependency in path operations
    to protect routes and get the current user's ID.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub") # Assuming 'sub' (subject) claim holds the user_id
        if user_id is None:
            raise credentials_exception
        # token_data = TokenData(user_id=user_id) # You can use this if you need to validate more claims
    except JWTError:
        raise credentials_exception
    # Here you could fetch the user from DB if needed, e.g. to check if active
    # For now, just returning the user_id from the token
    return user_id

# Example of how to protect an endpoint and get the user:
# from fastapi import APIRouter
# router = APIRouter()
# @router.get("/users/me")
# async def read_users_me(current_user_id: str = Depends(get_current_user_id)):
#     return {"user_id": current_user_id}
