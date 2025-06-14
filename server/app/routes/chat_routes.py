from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
import uuid

from app.schemas.chat_schemas import (
    ChatSessionCreate, ChatSessionResponse, ChatSessionUpdate, ChatMessageBase,
    ChatMessageCreate, ChatMessageResponse, ChatSessionDetailResponse
)
from app.models.user_model import User
from app.utils.security import get_current_user_and_token
from app.schemas.auth_schemas import CurrentUserWithToken
from app.supabase_client import create_supabase_client_with_jwt
from app.services.llm_service import LLMService
from app.models.agent import Agent as AgentModel
from datetime import datetime


def _calculate_cost(model_name: str, input_tokens: int, output_tokens: int) -> float:
    MODEL_PRICING = {
        "gemini-1.5-flash": {"input": 0.50, "output": 1.50},
        "gemini-1.5-pro": {"input": 7.00, "output": 21.00},
        "default": {"input": 0.50, "output": 1.50}
    }
    pricing = MODEL_PRICING.get(model_name, MODEL_PRICING["default"])
    input_cost = (input_tokens / 1_000_000) * pricing["input"]
    output_cost = (output_tokens / 1_000_000) * pricing["output"]
    return input_cost + output_cost


async def create_chat_session(session_data: ChatSessionCreate, current_user: User, jwt_token: str) -> ChatSessionResponse:
    db = create_supabase_client_with_jwt(jwt_token)
    insert_data = session_data.dict()
    insert_data['user_id'] = str(current_user.id)
    insert_data['agent_id'] = str(session_data.agent_id)
    response = await db.table('chat_sessions').insert(insert_data).execute()
    if not response.data:
        raise HTTPException(status_code=500, detail="Failed to create chat session")
    return ChatSessionResponse(**response.data[0])


async def get_chat_sessions(current_user: User, jwt_token: str, skip: int = 0, limit: int = 100) -> List[ChatSessionResponse]:
    db = create_supabase_client_with_jwt(jwt_token)
    response = await db.table('chat_sessions').select('*').eq('user_id', str(current_user.id)).order('updated_at', desc=True).offset(skip).limit(limit).execute()
    if response.data is None:
        return []
    return [ChatSessionResponse(**session) for session in response.data]


async def get_chat_session_detail(session_id: uuid.UUID, current_user: User, jwt_token: str) -> ChatSessionDetailResponse:
    db = create_supabase_client_with_jwt(jwt_token)
    session_response = await db.table('chat_sessions').select('*').eq('id', str(session_id)).eq('user_id', str(current_user.id)).maybe_single().execute()
    if not session_response.data:
        raise HTTPException(status_code=404, detail="Chat session not found or access denied")
    messages_response = await db.table('chat_messages').select('*').eq('session_id', str(session_id)).order('created_at', desc=False).execute()
    return ChatSessionDetailResponse(
        **session_response.data,
        messages=[ChatMessageResponse(**msg) for msg in messages_response.data]
    )


async def update_chat_session(session_id: uuid.UUID, session_data: ChatSessionUpdate, current_user: User, jwt_token: str) -> ChatSessionResponse:
    db = create_supabase_client_with_jwt(jwt_token)
    update_payload = session_data.dict(exclude_unset=True)
    if not update_payload:
        raise HTTPException(status_code=400, detail="No fields to update")
    response = await db.table('chat_sessions').update(update_payload).eq('id', str(session_id)).eq('user_id', str(current_user.id)).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Chat session not found or update failed")
    return ChatSessionResponse(**response.data[0])


async def delete_chat_session(session_id: uuid.UUID, current_user: User, jwt_token: str) -> None:
    db = create_supabase_client_with_jwt(jwt_token)
    response = await db.table('chat_sessions').delete().eq('id', str(session_id)).eq('user_id', str(current_user.id)).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Chat session not found or delete failed")
    return None


async def add_chat_message(message_data: ChatMessageCreate, current_user: User, jwt_token: str) -> ChatMessageResponse:
    db = create_supabase_client_with_jwt(jwt_token)
    session_check = await db.table('chat_sessions').select('id').eq('id', str(message_data.session_id)).eq('user_id', str(current_user.id)).maybe_single().execute()
    if not session_check.data:
        raise HTTPException(status_code=404, detail="Chat session not found or access denied")
    insert_data = message_data.dict()
    response = await db.table('chat_messages').insert(insert_data).execute()
    if not response.data:
        raise HTTPException(status_code=500, detail="Failed to add chat message")
    return ChatMessageResponse(**response.data[0])


async def list_chat_messages(session_id: uuid.UUID, current_user: User, jwt_token: str, skip: int = 0, limit: int = 100) -> List[ChatMessageResponse]:
    db = create_supabase_client_with_jwt(jwt_token)
    session_check = await db.table('chat_sessions').select('id').eq('id', str(session_id)).eq('user_id', str(current_user.id)).maybe_single().execute()
    if not session_check.data:
        raise HTTPException(status_code=404, detail="Chat session not found or access denied")
    response = await db.table('chat_messages').select('*').eq('session_id', str(session_id)).order('created_at', desc=False).offset(skip).limit(limit).execute()
    if response.data is None:
        return []
    return [ChatMessageResponse(**msg) for msg in response.data]


async def _get_or_create_session(user_id: uuid.UUID, agent_id: uuid.UUID, jwt_token: str) -> ChatSessionResponse:
    db = create_supabase_client_with_jwt(jwt_token)
    response = await db.table('chat_sessions').select('*').eq('user_id', str(user_id)).eq('agent_id', str(agent_id)).order('updated_at', desc=True).maybe_single().execute()
    if response.data:
        updated_session_response = await db.table('chat_sessions').update({'updated_at': datetime.utcnow().isoformat()}).eq('id', str(response.data['id'])).execute()
        if updated_session_response.data and len(updated_session_response.data) > 0:
            return ChatSessionResponse(**updated_session_response.data[0])
        return ChatSessionResponse(**response.data)
    agent_details_res = await db.table('agents').select('name').eq('id', str(agent_id)).maybe_single().execute()
    agent_name = agent_details_res.data['name'] if agent_details_res.data else f"Agent {str(agent_id)[:8]}"
    new_session_data = ChatSessionCreate(agent_id=agent_id, session_title=f"Chat with {agent_name}")
    insert_payload = new_session_data.dict()
    insert_payload['user_id'] = str(user_id)
    insert_response = await db.table('chat_sessions').insert(insert_payload).execute()
    if not insert_response.data or len(insert_response.data) == 0:
        raise HTTPException(status_code=500, detail="Failed to create new chat session")
    return ChatSessionResponse(**insert_response.data[0])


async def process_agent_message(
    agent_id: uuid.UUID,
    user_id: uuid.UUID,
    user_message_content: str,
    user_message_metadata: Optional[Dict[str, Any]],
    jwt_token: str,
    llm_service: LLMService,
) -> ChatMessageResponse:
    db = create_supabase_client_with_jwt(jwt_token)
    session = await _get_or_create_session(user_id, agent_id, jwt_token)
    user_message_to_insert = {
        "session_id": str(session.id),
        "sender_type": 'USER',
        "content": user_message_content,
        "content_metadata": user_message_metadata
    }
    user_msg_db_res = await db.table('chat_messages').insert(user_message_to_insert).execute()
    if not user_msg_db_res.data or len(user_msg_db_res.data) == 0:
        raise HTTPException(status_code=500, detail="Failed to store user message")
    history_response = await db.table('chat_messages').select('*').eq('session_id', str(session.id)).neq('id', str(user_msg_db_res.data[0]['id'])).order('created_at', desc=False).execute()
    conversation_history: List[ChatMessageResponse] = []
    if history_response.data:
        conversation_history = [ChatMessageResponse(**msg) for msg in history_response.data]
    agent_config_res = await db.table('agents').select('*').eq('id', str(agent_id)).maybe_single().execute()
    if not agent_config_res.data:
        raise HTTPException(status_code=404, detail="Agent not found")
    try:
        agent_model_instance = AgentModel(**agent_config_res.data)
    except Exception as e:
        print(f"Error converting agent data to AgentModel: {e}. Data: {agent_config_res.data}")
        raise HTTPException(status_code=500, detail=f"Invalid agent configuration: {e}")
    llm_response_content, token_usage = await llm_service.generate_response(
        agent_config=agent_model_instance,
        conversation_history=conversation_history,
        user_message_content=user_message_content
    )
    agent_message_to_insert = {
        "session_id": str(session.id),
        "sender_type": 'AGENT',
        "content": llm_response_content
    }
    agent_msg_db_res = await db.table('chat_messages').insert(agent_message_to_insert).execute()
    if not agent_msg_db_res.data or len(agent_msg_db_res.data) == 0:
        raise HTTPException(status_code=500, detail="Failed to store agent message")
    try:
        cost = _calculate_cost(agent_model_instance.model, token_usage.get('input_tokens', 0), token_usage.get('output_tokens', 0))
        log_payload = {
            'user_id': str(user_id),
            'agent_id': str(agent_model_instance.id),
            'session_id': str(session.id),
            'event_type': 'chat_completion',
            'model_name': agent_model_instance.model,
            'input_tokens': token_usage.get('input_tokens', 0),
            'output_tokens': token_usage.get('output_tokens', 0),
            'cost': cost,
            'details': {'service': 'llm_service', 'action': 'generate_response'}
        }
        await db.table('usage_metrics').insert(log_payload).execute()
    except Exception as e:
        print(f"ERROR: Could not log usage metrics for session {session.id}: {e}")
    return ChatMessageResponse(**agent_msg_db_res.data[0])

router = APIRouter(
    prefix="/chat",
    tags=["Chat"],
    responses={404: {"description": "Not found"}},
)

# Chat Session Endpoints
@router.post("/sessions/", response_model=ChatSessionResponse, status_code=status.HTTP_201_CREATED)
async def create_session(
    session_data: ChatSessionCreate,
    user_data: CurrentUserWithToken = Depends(get_current_user_and_token)
):
    return await create_chat_session(session_data, user_data.user, user_data.jwt_token)

@router.get("/sessions/", response_model=List[ChatSessionResponse])
async def list_sessions(
    skip: int = 0,
    limit: int = 100,
    user_data: CurrentUserWithToken = Depends(get_current_user_and_token)
):
    return await get_chat_sessions(user_data.user, user_data.jwt_token, skip, limit)

@router.get("/sessions/{session_id}", response_model=ChatSessionDetailResponse)
async def get_session_detail(
    session_id: uuid.UUID,
    user_data: CurrentUserWithToken = Depends(get_current_user_and_token)
):
    return await get_chat_session_detail(session_id, user_data.user, user_data.jwt_token)

@router.patch("/sessions/{session_id}", response_model=ChatSessionResponse)
async def update_session(
    session_id: uuid.UUID,
    session_data: ChatSessionUpdate,
    user_data: CurrentUserWithToken = Depends(get_current_user_and_token)
):
    return await update_chat_session(session_id, session_data, user_data.user, user_data.jwt_token)

@router.delete("/sessions/{session_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_session(
    session_id: uuid.UUID,
    user_data: CurrentUserWithToken = Depends(get_current_user_and_token)
):
    await delete_chat_session(session_id, user_data.user, user_data.jwt_token)
    return None

# Chat Message Endpoints
@router.post("/sessions/{session_id}/messages/", response_model=ChatMessageResponse, status_code=status.HTTP_201_CREATED)
async def add_message_to_session(
    session_id: uuid.UUID,
    message_data_base: ChatMessageBase,
    user_data: CurrentUserWithToken = Depends(get_current_user_and_token)
):
    message_create = ChatMessageCreate(
        session_id=session_id,
        **message_data_base.dict()
    )
    return await add_chat_message(message_create, user_data.user, user_data.jwt_token)

@router.get("/sessions/{session_id}/messages/", response_model=List[ChatMessageResponse])
async def list_messages_for_session(
    session_id: uuid.UUID,
    skip: int = 0,
    limit: int = 100,
    user_data: CurrentUserWithToken = Depends(get_current_user_and_token)
):
    return await list_chat_messages(session_id, user_data.user, user_data.jwt_token, skip, limit)


@router.post("/{agent_id}/message", response_model=ChatMessageResponse, summary="Post a message to an agent and get a response")
async def post_agent_message(
    agent_id: uuid.UUID,
    user_message_payload: ChatMessageBase,
    user_data: CurrentUserWithToken = Depends(get_current_user_and_token),
    llm_service: LLMService = Depends(LLMService)
):
    if user_message_payload.sender_type != 'USER':
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Sender type must be USER for this endpoint.")

    agent_response_message = await process_agent_message(
        agent_id=agent_id,
        user_id=user_data.user.id,
        user_message_content=user_message_payload.content,
        user_message_metadata=user_message_payload.content_metadata,
        jwt_token=user_data.jwt_token,
        llm_service=llm_service
    )
    return agent_response_message
