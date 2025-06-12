from pydantic import BaseModel
from typing import Optional

class Secret(BaseModel):
    key: str
    value: str # The value will be encrypted in storage
    description: Optional[str] = None

class SecretStored(BaseModel):
    key: str
    description: Optional[str] = None
