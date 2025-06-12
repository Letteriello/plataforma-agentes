from fastapi import HTTPException, Depends
from typing import List, Optional, Dict, Any # Added Dict, Any
import uuid
from datetime import datetime # Added datetime

from app.schemas.chat_schemas import (
    ChatSessionCreate, ChatSessionResponse, ChatSessionUpdate,
    ChatMessageCreate, ChatMessageResponse, ChatSessionDetailResponse
)
from app.services.supabase_service import SupabaseService
from app.models.user_model import User # For user dependency
from app.utils.security import get_current_user # For user dependency
from app.services.llm_service import LLMService # Added LLMService
from app.models.agent import Agent as AgentModel # Added AgentModel for type casting

class ChatController:
    def __init__(self, 
                 supabase_service: SupabaseService = Depends(SupabaseService.get_instance),
                 llm_service: LLMService = Depends(LLMService) # Added LLMService dependency
                ):
        self.db = supabase_service
        self.llm_service = llm_service

    async def create_chat_session(self, session_data: ChatSessionCreate, current_user: User = Depends(get_current_user)) -> ChatSessionResponse:
        user_id = current_user.id
        # Validate agent_id exists (optional, can be handled by FK constraint)
        # agent_check = await self.db.table('agents').select('id').eq('id', session_data.agent_id).maybe_single().execute()
        # if not agent_check.data:
        #     raise HTTPException(status_code=404, detail=f"Agent with id {session_data.agent_id} not found")

        insert_data = session_data.dict()
        insert_data['user_id'] = str(user_id) # Ensure UUID is string for Supabase client if needed
        insert_data['agent_id'] = str(session_data.agent_id)

        response = await self.db.table('chat_sessions').insert(insert_data).execute()
        if not response.data:
            raise HTTPException(status_code=500, detail="Failed to create chat session")
        
        created_session = response.data[0]
        return ChatSessionResponse(**created_session)

    async def get_chat_sessions(self, current_user: User = Depends(get_current_user), skip: int = 0, limit: int = 100) -> List[ChatSessionResponse]:
        user_id = current_user.id
        response = await self.db.table('chat_sessions').select('*')\
            .eq('user_id', str(user_id))\
            .order('updated_at', desc=True)\
            .offset(skip).limit(limit).execute()
        
        if response.data is None: # Check for None explicitly if API can return it
            return []
        return [ChatSessionResponse(**session) for session in response.data]

    async def get_chat_session_detail(self, session_id: uuid.UUID, current_user: User = Depends(get_current_user)) -> ChatSessionDetailResponse:
        user_id = current_user.id
        # Fetch session (RLS ensures user owns it)
        session_response = await self.db.table('chat_sessions').select('*')\
            .eq('id', str(session_id))\
            .eq('user_id', str(user_id))\
            .maybe_single().execute()

        if not session_response.data:
            raise HTTPException(status_code=404, detail="Chat session not found or access denied")

        # Fetch messages for the session
        messages_response = await self.db.table('chat_messages').select('*')\
            .eq('session_id', str(session_id))\
            .order('created_at', desc=False).execute() # Typically ascending for messages
        
        session_detail = ChatSessionDetailResponse(
            **session_response.data,
            messages=[ChatMessageResponse(**msg) for msg in messages_response.data]
        )
        return session_detail
    
    async def update_chat_session(self, session_id: uuid.UUID, session_data: ChatSessionUpdate, current_user: User = Depends(get_current_user)) -> ChatSessionResponse:
        user_id = current_user.id
        update_payload = session_data.dict(exclude_unset=True)
        if not update_payload:
            raise HTTPException(status_code=400, detail="No fields to update")

        response = await self.db.table('chat_sessions').update(update_payload)\
            .eq('id', str(session_id))\
            .eq('user_id', str(user_id))\
            .execute()

        if not response.data:
            raise HTTPException(status_code=404, detail="Chat session not found, access denied, or no changes made")
        return ChatSessionResponse(**response.data[0])

    async def delete_chat_session(self, session_id: uuid.UUID, current_user: User = Depends(get_current_user)) -> None:
        user_id = current_user.id
        response = await self.db.table('chat_sessions').delete()\
            .eq('id', str(session_id))\
            .eq('user_id', str(user_id))\
            .execute()
        
        if not response.data: # Supabase delete returns the deleted records
            raise HTTPException(status_code=404, detail="Chat session not found or access denied")
        return None # Successfully deleted

    async def add_chat_message(self, message_data: ChatMessageCreate, current_user: User = Depends(get_current_user)) -> ChatMessageResponse:
        user_id = current_user.id
        # RLS Policy: "Allow user to INSERT messages in own sessions" AND sender_type = 'USER'
        # We must ensure the session_id belongs to the current_user.
        # The RLS policy on chat_messages for INSERT checks this via a subquery on chat_sessions.
        # It also checks sender_type = 'USER'.
        
        if message_data.sender_type != 'USER':
             raise HTTPException(status_code=403, detail="User can only send messages as 'USER' type.")

        insert_data = message_data.dict()
        insert_data['session_id'] = str(message_data.session_id)
        # user_id is not directly on chat_messages, but linked via session_id and its RLS

        response = await self.db.table('chat_messages').insert(insert_data).execute()
        if not response.data:
            raise HTTPException(status_code=500, detail="Failed to add message or session not found/access denied")
        
        created_message = response.data[0]
        return ChatMessageResponse(**created_message)
    
    async def list_chat_messages(self, session_id: uuid.UUID, current_user: User = Depends(get_current_user), skip: int = 0, limit: int = 100) -> List[ChatMessageResponse]:
        user_id = current_user.id
        # RLS policy "Allow user to SELECT messages in own sessions" protects this.
        # First, verify the session exists and belongs to the user (optional, RLS handles it but good for early exit)
        session_check = await self.db.table('chat_sessions').select('id')\
            .eq('id', str(session_id))\
            .eq('user_id', str(user_id))\
            .maybe_single().execute()
        if not session_check.data:
            raise HTTPException(status_code=404, detail="Chat session not found or access denied")

        response = await self.db.table('chat_messages').select('*')\
            .eq('session_id', str(session_id))\
            .order('created_at', desc=False) \
            .offset(skip).limit(limit).execute()
        
        if response.data is None:
            return []
        return [ChatMessageResponse(**msg) for msg in response.data]

    async def _get_or_create_session(self, user_id: uuid.UUID, agent_id: uuid.UUID) -> ChatSessionResponse:
        # Try to find an existing session (e.g., the most recent one)
        response = await self.db.table('chat_sessions').select('*') \
            .eq('user_id', str(user_id)) \
            .eq('agent_id', str(agent_id)) \
            .order('updated_at', desc=True) \
            .limit(1).maybe_single().execute()

        if response.data:
            # Update updated_at for the found session to mark it as recently used
            updated_session_response = await self.db.table('chat_sessions') \
                .update({'updated_at': datetime.utcnow().isoformat()}) \
                .eq('id', str(response.data['id'])) \
                .execute() # Supabase returns list of updated records
            
            # Check if update was successful and data is returned
            if updated_session_response.data and len(updated_session_response.data) > 0:
                 return ChatSessionResponse(**updated_session_response.data[0])
            # Fallback to original data if update didn't return data as expected
            return ChatSessionResponse(**response.data) 

        # If no session found, create a new one
        agent_details_res = await self.db.table('agents').select('name').eq('id', str(agent_id)).maybe_single().execute()
        agent_name = agent_details_res.data['name'] if agent_details_res.data else f"Agent {str(agent_id)[:8]}"
        
        new_session_data = ChatSessionCreate(
            agent_id=agent_id, 
            session_title=f"Chat with {agent_name}"
        )
        
        insert_payload = new_session_data.dict()
        insert_payload['user_id'] = str(user_id)
        
        insert_response = await self.db.table('chat_sessions').insert(insert_payload).execute()
        if not insert_response.data or len(insert_response.data) == 0:
            raise HTTPException(status_code=500, detail="Failed to create new chat session")
        return ChatSessionResponse(**insert_response.data[0])

    async def process_agent_message(
        self, 
        agent_id: uuid.UUID, 
        user_id: uuid.UUID, 
        user_message_content: str,
        user_message_metadata: Optional[Dict[str, Any]]
    ) -> ChatMessageResponse:
        session = await self._get_or_create_session(user_id, agent_id)

        user_message_to_insert = {
            "session_id": str(session.id),
            "sender_type": 'USER',
            "content": user_message_content,
            "content_metadata": user_message_metadata
        }
        
        user_msg_db_res = await self.db.table('chat_messages').insert(user_message_to_insert).execute()
        if not user_msg_db_res.data or len(user_msg_db_res.data) == 0:
            raise HTTPException(status_code=500, detail="Failed to store user message")
        
        # Fetch conversation history for the LLM
        history_response = await self.db.table('chat_messages').select('*') \
            .eq('session_id', str(session.id)) \
            .neq('id', str(user_msg_db_res.data[0]['id'])) \ # Exclude the just-added user message if LLM expects only prior turns
            .order('created_at', desc=False).execute()
        
        conversation_history: List[ChatMessageResponse] = []
        if history_response.data:
            conversation_history = [ChatMessageResponse(**msg) for msg in history_response.data]

        agent_config_res = await self.db.table('agents').select('*').eq('id', str(agent_id)).maybe_single().execute()
        if not agent_config_res.data:
            raise HTTPException(status_code=404, detail="Agent not found")
        
        # Convert dict to AgentModel Pydantic model
        # This assumes agent_config_res.data matches the AgentModel schema
        try:
            agent_model_instance = AgentModel(**agent_config_res.data)
        except Exception as e:
            # Log the validation error details
            print(f"Error converting agent data to AgentModel: {e}. Data: {agent_config_res.data}")
            raise HTTPException(status_code=500, detail=f"Invalid agent configuration: {e}")

        # LLM interaction using LLMService
        llm_response_content = await self.llm_service.generate_response(
            agent_config=agent_model_instance,
            conversation_history=conversation_history, # Pass history up to, but not including, current user message
            user_message_content=user_message_content
        )
        
        agent_message_to_insert = {
            "session_id": str(session.id),
            "sender_type": 'AGENT',
            "content": llm_response_content
        }
        agent_msg_db_res = await self.db.table('chat_messages').insert(agent_message_to_insert).execute()
        if not agent_msg_db_res.data or len(agent_msg_db_res.data) == 0:
            raise HTTPException(status_code=500, detail="Failed to store agent message")
        
        return ChatMessageResponse(**agent_msg_db_res.data[0])
