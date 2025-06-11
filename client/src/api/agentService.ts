import apiClient from '@/api/apiClient'
export interface AgentDTO {
  id: string
  name: string
  description?: string
  type: string
}

export interface CreateAgentDTO {
  name: string
  description?: string
  type: string
}

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

export default {
  fetchAgents,
  fetchAgentById,
  createAgent,
  updateAgent,
  deleteAgent,
}
