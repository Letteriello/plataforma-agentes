from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
import uuid

class ChatMessageBase(BaseModel):
    sender_type: str = Field(..., pattern="^(USER|AGENT|SYSTEM)$")
    content: str
    content_metadata: Optional[Dict[str, Any]] = None

class ChatMessageCreate(ChatMessageBase):
    session_id: uuid.UUID # Provided when creating a message within an existing session

class ChatMessageResponse(ChatMessageBase):
    id: uuid.UUID
    session_id: uuid.UUID
    created_at: datetime
    token_count: Optional[int] = None
    parent_message_id: Optional[uuid.UUID] = None

    class Config:
        orm_mode = True

class ChatSessionBase(BaseModel):
    agent_id: uuid.UUID
    session_title: Optional[str] = None
    session_metadata: Optional[Dict[str, Any]] = None

class ChatSessionCreate(ChatSessionBase):
    pass

class ChatSessionUpdate(BaseModel):
    session_title: Optional[str] = None
    session_metadata: Optional[Dict[str, Any]] = None

class ChatSessionResponse(ChatSessionBase):
    id: uuid.UUID
    user_id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    # Optionally include last message or message count
    # last_message: Optional[ChatMessageResponse] = None 

    class Config:
        orm_mode = True

class ChatSessionDetailResponse(ChatSessionResponse):
    messages: List[ChatMessageResponse] = []
