import apiClient from './apiClient';
import {
  ChatSession,
  ChatSessionCreatePayload,
  ChatSessionUpdatePayload,
  ChatSessionDetail,
  ChatMessage,
  ChatMessageCreatePayload, // This includes sender_type
  // UserAgentMessagePayload, // Alternative for postMessageToAgent if sender_type is implicit
} from '../types/chatTypes';

const CHAT_BASE_URL = '/chat'; // Matches the router prefix in backend

const chatService = {
  // == Chat Session Management ==
  createSession: async (sessionData: ChatSessionCreatePayload): Promise<ChatSession> => {
    const response = await apiClient.post<ChatSession>(`${CHAT_BASE_URL}/sessions/`, sessionData);
    return response.data;
  },

  getSessions: async (): Promise<ChatSession[]> => {
    const response = await apiClient.get<ChatSession[]>(`${CHAT_BASE_URL}/sessions/`);
    return response.data;
  },

  getSessionDetail: async (sessionId: string): Promise<ChatSessionDetail> => {
    const response = await apiClient.get<ChatSessionDetail>(`${CHAT_BASE_URL}/sessions/${sessionId}`);
    return response.data;
  },

  updateSession: async (sessionId: string, sessionData: ChatSessionUpdatePayload): Promise<ChatSession> => {
    const response = await apiClient.patch<ChatSession>(`${CHAT_BASE_URL}/sessions/${sessionId}`, sessionData);
    return response.data;
  },

  deleteSession: async (sessionId: string): Promise<void> => {
    await apiClient.delete(`${CHAT_BASE_URL}/sessions/${sessionId}`);
  },

  // == Chat Message Management ==
  // For adding a message to an existing, known session
  addMessageToSession: async (sessionId: string, messageData: ChatMessageCreatePayload): Promise<ChatMessage> => {
    const response = await apiClient.post<ChatMessage>(`${CHAT_BASE_URL}/sessions/${sessionId}/messages/`, messageData);
    return response.data;
  },

  listMessagesForSession: async (sessionId: string): Promise<ChatMessage[]> => {
    const response = await apiClient.get<ChatMessage[]>(`${CHAT_BASE_URL}/sessions/${sessionId}/messages/`);
    return response.data;
  },
  
  // For sending a message directly to an agent (backend handles session creation/retrieval)
  postMessageToAgent: async (agentId: string, messageData: ChatMessageCreatePayload): Promise<ChatMessage> => {
    // Backend route for this is POST /chat/{agent_id}/message
    // The payload for this backend route is ChatMessageBase (content, sender_type, content_metadata)
    // ChatMessageCreatePayload matches this if session_id is ignored by the backend for this specific route (which it should be)
    // Ensure sender_type is 'USER' as per backend validation for this route.
    const response = await apiClient.post<ChatMessage>(`${CHAT_BASE_URL}/${agentId}/message`, messageData);
    return response.data;
  },
};

export default chatService;
