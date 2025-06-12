import axios from 'axios'
import apiClient from '@/api/apiClient'
import type { Session, ChatMessage, Attachment } from '@/types'

export interface IChatService {
  fetchSessions(userId: string): Promise<Session[]>
  fetchSessionById(sessionId: string): Promise<Session | null>
  fetchSessionMessages(sessionId: string): Promise<ChatMessage[]>
  sendMessage(
    sessionId: string,
    messageContent: string,
    attachments?: Attachment[],
  ): Promise<ChatMessage>
  startNewSession(userId: string, agentId: string): Promise<Session>
  deleteSession(sessionId: string): Promise<void>
  clearHistory(sessionId: string): Promise<void>
  updateSession(sessionId: string, data: Partial<Session>): Promise<Session>
}

export const chatService: IChatService = {
  async fetchSessions(userId: string): Promise<Session[]> {
    const { data } = await apiClient.get<Session[]>('/sessions', {
      params: { userId },
    })
    return data
  },

  async fetchSessionById(sessionId: string): Promise<Session | null> {
    try {
      const { data } = await apiClient.get<Session>(`/sessions/${sessionId}`)
      return data
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null // Session not found, return null as per contract
      }
      throw error // Re-throw other errors
    }
  },

  async fetchSessionMessages(sessionId: string): Promise<ChatMessage[]> {
    const { data } = await apiClient.get<ChatMessage[]>(
      `/sessions/${sessionId}/messages`,
    )
    return data
  },

  async sendMessage(
    sessionId: string,
    messageContent: string,
    attachments?: Attachment[],
  ): Promise<ChatMessage> {
    const payload = {
      content: messageContent,
      attachments,
    }
    const { data } = await apiClient.post<ChatMessage>(
      `/sessions/${sessionId}/messages`,
      payload,
    )
    return data
  },

  async startNewSession(userId: string, agentId: string): Promise<Session> {
    const { data } = await apiClient.post<Session>('/sessions', {
      userId,
      agentId,
    })
    return data
  },

  async deleteSession(sessionId: string): Promise<void> {
    await apiClient.delete(`/sessions/${sessionId}`)
  },

  async clearHistory(sessionId: string): Promise<void> {
    await apiClient.post(`/sessions/${sessionId}/clear-history`)
  },

  async updateSession(
    sessionId: string,
    data: Partial<Session>,
  ): Promise<Session> {
    const { data: responseData } = await apiClient.put<Session>(
      `/sessions/${sessionId}`,
      data,
    )
    return responseData
  },
}

export default chatService
