import { Session, ChatMessage } from '@/types';
import apiClient from './apiClient'; // Still used for other methods
import { getApiBaseUrlFromEnv } from '../config'; // Import the new config function

export interface IChatService {
  /** Lista as sess\u00f5es de um usu\u00e1rio */
  fetchSessions(userId: string): Promise<Session[]>;
  /** Carrega mensagens de uma sess\u00e3o */
  fetchSessionMessages(sessionId: string): Promise<ChatMessage[]>;
  /** Envia uma mensagem e processa a resposta como stream */
  sendMessage(
    sessionId: string,
    message: Omit<ChatMessage, 'id' | 'isStreaming' | 'streamId'>, // Ensure these are not expected from caller
    onChunkReceived: (chunk: string, isLastChunk: boolean, streamId?: string) => void,
    // streamId is passed to onChunkReceived to help UI identify the message being streamed
    // It could be generated here or passed in if preferred. Let's generate it here for now.
  ): Promise<string>; // Returns a promise that resolves with the generated streamId
  /** Inicia uma nova sess\u00e3o */
  startNewSession(userId: string, agentId: string): Promise<Session>;
}

export const chatService: IChatService = {
  async fetchSessions(userId: string): Promise<Session[]> {
    try {
      const response = await apiClient.get<Session[]>(`/api/chat/sessions?userId=${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching sessions:', error);
      throw error;
    }
  },

  async fetchSessionMessages(sessionId: string): Promise<ChatMessage[]> {
    try {
      const response = await apiClient.get<ChatMessage[]>(`/api/chat/sessions/${sessionId}/messages`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching messages for session ${sessionId}:`, error);
      throw error;
    }
  },

  async sendMessage(
    sessionId: string,
    message: Omit<ChatMessage, 'id' | 'isStreaming' | 'streamId'>,
    onChunkReceived: (chunk: string, isLastChunk: boolean, streamId: string) => void,
  ): Promise<string> {
    const streamId = `stream-${crypto.randomUUID()}`; // Unique ID for this streaming operation
    try {
      const baseUrl = getApiBaseUrlFromEnv(); // Use the imported config function
      const response = await fetch(`${baseUrl}/api/chat/sessions/${sessionId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add any other necessary headers, like Authorization
        },
        body: JSON.stringify(message),
      });

      if (!response.ok) {
        // Attempt to read error body for more context
        const errorBody = await response.text();
        throw new Error(`HTTP error ${response.status}: ${response.statusText}. Body: ${errorBody}`);
      }

      if (!response.body) {
        throw new Error('Response body is null');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');

      let isFirstChunk = true;

      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          onChunkReceived('', true, streamId); // Signal end of stream
          break;
        }
        const chunkText = decoder.decode(value, { stream: true });

        // The backend should ideally send structured data (e.g. JSON objects per line for SSE)
        // For now, assuming raw text chunks for simplicity.
        // If each chunk is a self-contained JSON ChatMessage, parsing logic would be here.
        // If it's just text, the Page component will append it.
        onChunkReceived(chunkText, false, streamId);
        if (isFirstChunk) isFirstChunk = false;
      }
      return streamId; // Resolve with streamId when stream is fully processed
    } catch (error) {
      console.error(`Error sending streaming message to session ${sessionId}:`, error);
      // Call onChunkReceived with an error state or rely on promise rejection
      onChunkReceived('', true, streamId); // Signal end of stream even on error to stop UI loading state
      throw error; // Propagate the error
    }
  },

  async startNewSession(userId: string, agentId: string): Promise<Session> {
    try {
      const response = await apiClient.post<Session>('/api/chat/sessions', { userId, agentId });
      return response.data;
    } catch (error) {
      console.error('Error starting new session:', error);
      throw error;
    }
  },
};

export default chatService;
