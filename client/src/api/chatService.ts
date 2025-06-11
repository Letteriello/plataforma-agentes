import apiClient from '@/api/apiClient';
import { Session, ChatMessage, Attachment } from '@/types'; // Attachment might be part of ChatMessage

export interface IChatService {
  /** Lista as sess\u00f5es de um usu\u00e1rio */
  fetchSessions(userId: string): Promise<Session[]>;
  /** Carrega uma sess\u00e3o espec\u00edfica pelo ID */
  fetchSessionById(sessionId: string): Promise<Session | null>;
  /** Carrega mensagens de uma sess\u00e3o */
  fetchSessionMessages(sessionId: string): Promise<ChatMessage[]>;
  /** Envia uma mensagem */
  sendMessage(
    sessionId: string,
    messageContent: string,
    attachments?: Attachment[]
  ): Promise<ChatMessage>;
  /** Inicia uma nova sess\u00e3o */
  startNewSession(userId: string, agentId: string): Promise<Session>;
  /** Remove uma sess\u00e3o */
  deleteSession(sessionId: string): Promise<void>;
  /** Limpa o hist\u00f3rico de mensagens de uma sess\u00e3o */
  clearHistory(sessionId: string): Promise<void>;
  /** Atualiza dados de uma sess\u00e3o (ex: t\u00edtulo, metadados) */
  updateSession(sessionId: string, data: Partial<Session>): Promise<Session>;
}

export const chatService: IChatService = {
  async fetchSessions(userId: string): Promise<Session[]> {
    const response = await apiClient.get<Session[]>('/sessions', { params: { userId } });
    return response.data;
  },

  async fetchSessionById(sessionId: string): Promise<Session | null> {
    try {
      const response = await apiClient.get<Session>(`/sessions/${sessionId}`);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        return null;
      }
      throw error;
    }
  },

  async fetchSessionMessages(sessionId: string): Promise<ChatMessage[]> {
    const response = await apiClient.get<ChatMessage[]>(`/sessions/${sessionId}/messages`);
    return response.data;
  },

  async sendMessage(
    sessionId: string,
    messageContent: string,
    attachments?: Attachment[]
  ): Promise<ChatMessage> {
    // Adapting to a more common sendMessage payload structure
    const payload: { content: string; attachments?: Attachment[] } = { content: messageContent };
    if (attachments) {
      payload.attachments = attachments;
    }
    const response = await apiClient.post<ChatMessage>(`/sessions/${sessionId}/messages`, payload);
    return response.data;
  },

  async startNewSession(userId: string, agentId: string): Promise<Session> {
    const response = await apiClient.post<Session>('/sessions', { userId, agentId });
    return response.data;
  },

  async deleteSession(sessionId: string): Promise<void> {
    await apiClient.delete(`/sessions/${sessionId}`);
  },

  async clearHistory(sessionId: string): Promise<void> {
    // This could also be a DELETE to /sessions/:sessionId/messages
    await apiClient.post(`/sessions/${sessionId}/clear-history`);
  },

  async updateSession(sessionId: string, data: Partial<Session>): Promise<Session> {
    const response = await apiClient.put<Session>(`/sessions/${sessionId}`, data);
    return response.data;
  },
};

export default chatService;
