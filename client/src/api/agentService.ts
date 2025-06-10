import apiClient from '../apiClient'
import { AgentDTO, CreateAgentDTO } from '@/types/api'

export const fetchAgents = async (): Promise<AgentDTO[]> => {
  const { data } = await apiClient.get<AgentDTO[]>('/agents')
  return data
}

export const fetchAgentById = async (id: string): Promise<AgentDTO> => {
  const { data } = await apiClient.get<AgentDTO>(`/agents/${id}`)
  return data
}

export const createAgent = async (
  payload: CreateAgentDTO,
): Promise<AgentDTO> => {
  const { data } = await apiClient.post<AgentDTO>('/agents', payload)
  return data
}

export const updateAgent = async (
  id: string,
  payload: CreateAgentDTO,
): Promise<AgentDTO> => {
  const { data } = await apiClient.put<AgentDTO>(`/agents/${id}`, payload)
  return data
}

export const deleteAgent = async (id: string): Promise<void> => {
  await apiClient.delete(`/agents/${id}`)
}
