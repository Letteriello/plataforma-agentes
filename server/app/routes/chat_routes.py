from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
import uuid

from app.controllers.chat_controller import ChatController
from app.schemas.chat_schemas import (
    ChatSessionCreate, ChatSessionResponse, ChatSessionUpdate, ChatMessageBase,
    ChatMessageCreate, ChatMessageResponse, ChatSessionDetailResponse
)
from app.models.user_model import User
from app.utils.security import get_current_user_and_token # Updated import
from app.schemas.auth_schemas import CurrentUserWithToken # Added import

router = APIRouter(
    prefix="/chat",
    tags=["Chat"],
    responses={404: {"description": "Not found"}},
)

# Chat Session Endpoints
@router.post("/sessions/", response_model=ChatSessionResponse, status_code=status.HTTP_201_CREATED)
async def create_session(
    session_data: ChatSessionCreate,
    controller: ChatController = Depends(ChatController),
    user_data: CurrentUserWithToken = Depends(get_current_user_and_token) # Updated dependency
):
    return await controller.create_chat_session(session_data, user_data.user, user_data.jwt_token)

@router.get("/sessions/", response_model=List[ChatSessionResponse])
async def list_sessions(
    skip: int = 0,
    limit: int = 100,
    controller: ChatController = Depends(ChatController),
    user_data: CurrentUserWithToken = Depends(get_current_user_and_token) # Updated dependency
):
    return await controller.get_chat_sessions(user_data.user, user_data.jwt_token, skip, limit)

@router.get("/sessions/{session_id}", response_model=ChatSessionDetailResponse)
async def get_session_detail(
    session_id: uuid.UUID,
    controller: ChatController = Depends(ChatController),
    user_data: CurrentUserWithToken = Depends(get_current_user_and_token) # Updated dependency
):
    return await controller.get_chat_session_detail(session_id, user_data.user, user_data.jwt_token)

@router.patch("/sessions/{session_id}", response_model=ChatSessionResponse)
async def update_session(
    session_id: uuid.UUID,
    session_data: ChatSessionUpdate,
    controller: ChatController = Depends(ChatController),
    user_data: CurrentUserWithToken = Depends(get_current_user_and_token) # Updated dependency
):
    return await controller.update_chat_session(session_id, session_data, user_data.user, user_data.jwt_token)

@router.delete("/sessions/{session_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_session(
    session_id: uuid.UUID,
    controller: ChatController = Depends(ChatController),
    user_data: CurrentUserWithToken = Depends(get_current_user_and_token) # Updated dependency
):
    await controller.delete_chat_session(session_id, user_data.user, user_data.jwt_token)
    return None

# Chat Message Endpoints
@router.post("/sessions/{session_id}/messages/", response_model=ChatMessageResponse, status_code=status.HTTP_201_CREATED)
async def add_message_to_session(
    session_id: uuid.UUID,
    message_data_base: ChatMessageBase,
    controller: ChatController = Depends(ChatController),
    user_data: CurrentUserWithToken = Depends(get_current_user_and_token) # Updated dependency
):
    message_create = ChatMessageCreate(
        session_id=session_id,
        **message_data_base.dict()
    )
    return await controller.add_chat_message(message_create, user_data.user, user_data.jwt_token)

@router.get("/sessions/{session_id}/messages/", response_model=List[ChatMessageResponse])
async def list_messages_for_session(
    session_id: uuid.UUID,
    skip: int = 0,
    limit: int = 100,
    controller: ChatController = Depends(ChatController),
    user_data: CurrentUserWithToken = Depends(get_current_user_and_token) # Updated dependency
):
    return await controller.list_chat_messages(session_id, user_data.user, user_data.jwt_token, skip, limit)


@router.post("/{agent_id}/message", response_model=ChatMessageResponse, summary="Post a message to an agent and get a response")
async def post_agent_message(
    agent_id: uuid.UUID,
    user_message_payload: ChatMessageBase,
    controller: ChatController = Depends(ChatController),
    user_data: CurrentUserWithToken = Depends(get_current_user_and_token) # Updated dependency
):
    if user_message_payload.sender_type != 'USER':
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Sender type must be USER for this endpoint.")

    agent_response_message = await controller.process_agent_message(
        agent_id=agent_id,
        user_id=user_data.user.id,
        user_message_content=user_message_payload.content,
        user_message_metadata=user_message_payload.content_metadata,
        jwt_token=user_data.jwt_token # Pass jwt_token
    )
    return agent_response_message
