import os
from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel
from dotenv import load_dotenv

from app.models.user_model import User
from app.schemas.auth_schemas import CurrentUserWithToken
from app.supabase_client import create_supabase_client_with_jwt
from supabase import Client as SupabaseClient # For type hinting

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
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")

class TokenData(BaseModel):
    user_id: Optional[str] = None

# Removed duplicate CurrentUser class
# The CurrentUserWithToken schema from app.schemas.auth_schemas will be used

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
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    return user_id

async def get_current_user_and_token(token: str = Depends(oauth2_scheme)) -> CurrentUserWithToken:
    """
    Decodes the JWT token, validates it, fetches the full User object from DB,
    and returns a CurrentUserWithToken object.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    user_not_found_exception = HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="User not found in database",
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception

        # Create a user-scoped Supabase client to fetch user details
        # This client will operate under the permissions of the user identified by the token
        user_db: SupabaseClient = create_supabase_client_with_jwt(token)
        
        # Fetch user from the 'users' table in 'auth' schema (Supabase default)
        # Note: Supabase client typically uses 'id' as the column name for user ID in auth.users
        response = await user_db.table("users").select("id, email, created_at, updated_at, role, full_name, avatar_url, is_active, is_superuser").eq("id", user_id).maybe_single().execute()

        if not response.data:
            raise user_not_found_exception
        
        # Ensure all fields expected by the User model are present or handled with defaults
        # The User model might need adjustment if fields from auth.users are named differently or missing
        user_data = response.data
        # Map Supabase's auth.users fields to your User model fields if necessary
        # For example, if your User model expects 'username' but Supabase provides 'email'
        current_user_obj = User(
            id=user_data.get("id"),
            email=user_data.get("email"),
            created_at=user_data.get("created_at"),
            updated_at=user_data.get("updated_at"),
            role=user_data.get("role", "user"), # Provide a default if 'role' might be missing
            full_name=user_data.get("full_name"),
            avatar_url=user_data.get("avatar_url"),
            is_active=user_data.get("is_active", True),
            is_superuser=user_data.get("is_superuser", False)
            # Add other fields as defined in your User model
        )

        return CurrentUserWithToken(user=current_user_obj, jwt_token=token)

    except JWTError:
        raise credentials_exception
    except Exception as e:
        # Catch other potential errors during DB call or model instantiation
        print(f"Error in get_current_user_and_token: {e}") # For logging
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error processing user authentication."
        )

# Example of how to protect an endpoint and get the user:
# from fastapi import APIRouter
# router = APIRouter()
# @router.get("/users/me")
# async def read_users_me(user_data: CurrentUserWithToken = Depends(get_current_user_and_token)):
#     return {"user_id": user_data.user.id, "email": user_data.user.email, "token": user_data.jwt_token}
