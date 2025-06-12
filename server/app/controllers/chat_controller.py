from fastapi import HTTPException, Depends
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime
from supabase_py_async import AsyncClient as SupabaseClient

from app.schemas.chat_schemas import (
    ChatSessionCreate, ChatSessionResponse, ChatSessionUpdate,
    ChatMessageCreate, ChatMessageResponse, ChatSessionDetailResponse
)
from app.models.user_model import User
from app.services.llm_service import LLMService
from app.models.agent import Agent as AgentModel
from app.supabase_client import create_supabase_client_with_jwt

class ChatController:
    def __init__(self,
                 llm_service: LLMService = Depends(LLMService)
                ):
        self.llm_service = llm_service

    def _calculate_cost(self, model_name: str, input_tokens: int, output_tokens: int) -> float:
        # NOTE: Placeholder costs based on public pricing per 1 million tokens as of June 2025.
        # This should be moved to a centralized configuration service.
        MODEL_PRICING = {
            "gemini-1.5-flash": {"input": 0.50, "output": 1.50},
            "gemini-1.5-pro": {"input": 7.00, "output": 21.00},
            "default": {"input": 0.50, "output": 1.50} # Default to flash pricing for safety
        }

        pricing = MODEL_PRICING.get(model_name, MODEL_PRICING["default"])

        input_cost = (input_tokens / 1_000_000) * pricing["input"]
        output_cost = (output_tokens / 1_000_000) * pricing["output"]

        return input_cost + output_cost

    async def create_chat_session(self, session_data: ChatSessionCreate, current_user: User, jwt_token: str) -> ChatSessionResponse:
        db: SupabaseClient = create_supabase_client_with_jwt(jwt_token)
        user_id = current_user.id

        insert_data = session_data.dict()
        insert_data['user_id'] = str(user_id)
        insert_data['agent_id'] = str(session_data.agent_id)

        response = await db.table('chat_sessions').insert(insert_data).execute()
        if not response.data:
            raise HTTPException(status_code=500, detail="Failed to create chat session")

        created_session = response.data[0]
        return ChatSessionResponse(**created_session)

    async def get_chat_sessions(self, current_user: User, jwt_token: str, skip: int = 0, limit: int = 100) -> List[ChatSessionResponse]:
        db: SupabaseClient = create_supabase_client_with_jwt(jwt_token)
        user_id = current_user.id
        response = await db.table('chat_sessions').select('*')\
            .eq('user_id', str(user_id))\
            .order('updated_at', desc=True)\
            .offset(skip).limit(limit).execute()

        if response.data is None:
            return []
        return [ChatSessionResponse(**session) for session in response.data]

    async def get_chat_session_detail(self, session_id: uuid.UUID, current_user: User, jwt_token: str) -> ChatSessionDetailResponse:
        db: SupabaseClient = create_supabase_client_with_jwt(jwt_token)
        user_id = current_user.id

        session_response = await db.table('chat_sessions').select('*')\
            .eq('id', str(session_id))\
            .eq('user_id', str(user_id))\
            .maybe_single().execute()

        if not session_response.data:
            raise HTTPException(status_code=404, detail="Chat session not found or access denied")

        messages_response = await db.table('chat_messages').select('*')\
            .eq('session_id', str(session_id))\
            .order('created_at', desc=False).execute()

        session_detail = ChatSessionDetailResponse(
            **session_response.data,
            messages=[ChatMessageResponse(**msg) for msg in messages_response.data]
        )
        return session_detail

    async def update_chat_session(self, session_id: uuid.UUID, session_data: ChatSessionUpdate, current_user: User, jwt_token: str) -> ChatSessionResponse:
        db: SupabaseClient = create_supabase_client_with_jwt(jwt_token)
        user_id = current_user.id
        update_payload = session_data.dict(exclude_unset=True)
        if not update_payload:
            raise HTTPException(status_code=400, detail="No fields to update")

        response = await db.table('chat_sessions').update(update_payload)\
            .eq('id', str(session_id))\
            .eq('user_id', str(user_id))\
            .execute()

        if not response.data:
            raise HTTPException(status_code=404, detail="Chat session not found or update failed")

        return ChatSessionResponse(**response.data[0])

    async def delete_chat_session(self, session_id: uuid.UUID, current_user: User, jwt_token: str) -> Dict[str, str]:
        db: SupabaseClient = create_supabase_client_with_jwt(jwt_token)
        user_id = current_user.id
        response = await db.table('chat_sessions').delete()\
            .eq('id', str(session_id))\
            .eq('user_id', str(user_id))\
            .execute()

        if not response.data:
            raise HTTPException(status_code=404, detail="Chat session not found or delete failed")
        return {"message": "Chat session deleted successfully"}

    async def add_chat_message(self, message_data: ChatMessageCreate, current_user: User, jwt_token: str) -> ChatMessageResponse:
        db: SupabaseClient = create_supabase_client_with_jwt(jwt_token)
        user_id = current_user.id

        session_check = await db.table('chat_sessions').select('id')\
            .eq('id', str(message_data.session_id))\
            .eq('user_id', str(user_id))\
            .maybe_single().execute()

        if not session_check.data:
            raise HTTPException(status_code=404, detail="Chat session not found or access denied")

        insert_data = message_data.dict()
        response = await db.table('chat_messages').insert(insert_data).execute()
        if not response.data:
            raise HTTPException(status_code=500, detail="Failed to add chat message")

        return ChatMessageResponse(**response.data[0])

    async def list_chat_messages(self, session_id: uuid.UUID, current_user: User, jwt_token: str, skip: int = 0, limit: int = 100) -> List[ChatMessageResponse]:
        db: SupabaseClient = create_supabase_client_with_jwt(jwt_token)
        user_id = current_user.id

        session_check = await db.table('chat_sessions').select('id')\
            .eq('id', str(session_id))\
            .eq('user_id', str(user_id))\
            .maybe_single().execute()

        if not session_check.data:
            raise HTTPException(status_code=404, detail="Chat session not found or access denied")

        response = await db.table('chat_messages').select('*')\
            .eq('session_id', str(session_id))\
            .order('created_at', desc=False)\
            .offset(skip).limit(limit).execute()

        if response.data is None:
            return []
        return [ChatMessageResponse(**msg) for msg in response.data]

    async def _get_or_create_session(self, user_id: uuid.UUID, agent_id: uuid.UUID, jwt_token: str) -> ChatSessionResponse:
        db: SupabaseClient = create_supabase_client_with_jwt(jwt_token)

        response = await db.table('chat_sessions').select('*')\
            .eq('user_id', str(user_id))\
            .eq('agent_id', str(agent_id))\
            .order('updated_at', desc=True)\
            .maybe_single().execute()

        if response.data:
            updated_session_response = await db.table('chat_sessions')\
                .update({'updated_at': datetime.utcnow().isoformat()})\
                .eq('id', str(response.data['id']))\
                .execute()
            if updated_session_response.data and len(updated_session_response.data) > 0:
                 return ChatSessionResponse(**updated_session_response.data[0])
            return ChatSessionResponse(**response.data)

        agent_details_res = await db.table('agents').select('name').eq('id', str(agent_id)).maybe_single().execute()
        agent_name = agent_details_res.data['name'] if agent_details_res.data else f"Agent {str(agent_id)[:8]}"

        new_session_data = ChatSessionCreate(
            agent_id=agent_id,
            session_title=f"Chat with {agent_name}"
        )

        insert_payload = new_session_data.dict()
        insert_payload['user_id'] = str(user_id)

        insert_response = await db.table('chat_sessions').insert(insert_payload).execute()
        if not insert_response.data or len(insert_response.data) == 0:
            raise HTTPException(status_code=500, detail="Failed to create new chat session")
        return ChatSessionResponse(**insert_response.data[0])

    async def process_agent_message(
        self,
        agent_id: uuid.UUID,
        user_id: uuid.UUID,
        user_message_content: str,
        user_message_metadata: Optional[Dict[str, Any]],
        jwt_token: str
    ) -> ChatMessageResponse:
        db: SupabaseClient = create_supabase_client_with_jwt(jwt_token)
        session = await self._get_or_create_session(user_id, agent_id, jwt_token)

        user_message_to_insert = {
            "session_id": str(session.id),
            "sender_type": 'USER',
            "content": user_message_content,
            "content_metadata": user_message_metadata
        }

        user_msg_db_res = await db.table('chat_messages').insert(user_message_to_insert).execute()
        if not user_msg_db_res.data or len(user_msg_db_res.data) == 0:
            raise HTTPException(status_code=500, detail="Failed to store user message")

        history_response = await db.table('chat_messages').select('*') \
            .eq('session_id', str(session.id)) \
            .neq('id', str(user_msg_db_res.data[0]['id'])) \
            .order('created_at', desc=False).execute()

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

        llm_response_content, token_usage = await self.llm_service.generate_response(
            agent_config=agent_model_instance,
            conversation_history=conversation_history,
            user_message_content=user_message_content
        )

        # Store agent message
        agent_message_to_insert = {
            "session_id": str(session.id),
            "sender_type": 'AGENT',
            "content": llm_response_content
        }
        agent_msg_db_res = await db.table('chat_messages').insert(agent_message_to_insert).execute()
        if not agent_msg_db_res.data or len(agent_msg_db_res.data) == 0:
            raise HTTPException(status_code=500, detail="Failed to store agent message")

        # Log usage metrics asynchronously
        try:
            cost = self._calculate_cost(
                model_name=agent_model_instance.model,
                input_tokens=token_usage.get('input_tokens', 0),
                output_tokens=token_usage.get('output_tokens', 0)
            )

            log_payload = {
                'user_id': str(current_user.id),
                'agent_id': str(agent_model_instance.id),
                'session_id': str(session.id),
                'event_type': 'chat_completion',
                'model_name': agent_model_instance.model,
                'input_tokens': token_usage.get('input_tokens', 0),
                'output_tokens': token_usage.get('output_tokens', 0),
                'cost': cost,
                'details': {
                    'service': 'llm_service',
                    'action': 'generate_response'
                }
            }
            await db.table('usage_metrics').insert(log_payload).execute()
        except Exception as e:
            # Log the error but don't fail the request
            print(f"ERROR: Could not log usage metrics for session {session.id}: {e}")

        return ChatMessageResponse(**agent_msg_db_res.data[0])
