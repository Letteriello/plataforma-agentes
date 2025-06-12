from pydantic import BaseModel
from app.models.user_model import User # Assuming User model is in app.models.user_model

class CurrentUserWithToken(BaseModel):
    user: User
    jwt_token: str
