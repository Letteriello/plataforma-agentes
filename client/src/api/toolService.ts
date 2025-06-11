import apiClient from '@/api/apiClient'
import type { ToolDefinition } from '@/types'

/**
 * Data Transfer Object for a Tool, omitting the 'execute' function.
 * The backend will not send the implementation of the function.
 */
export interface ToolDTO extends Omit<ToolDefinition, 'execute'> {
  id: string
}

/**
 * DTO for creating a new Tool.
 */
export type CreateToolDTO = Omit<ToolDTO, 'id'>

/**
 * DTO for updating a Tool.
 */
export type UpdateToolDTO = Partial<CreateToolDTO>

export const fetchTools = async (): Promise<ToolDTO[]> => {
  const { data } = await apiClient.get<ToolDTO[]>('/tools')
  return data
}

export const fetchToolById = async (id: string): Promise<ToolDTO> => {
  const { data } = await apiClient.get<ToolDTO>(`/tools/${id}`)
  return data
}

export const createTool = async (payload: CreateToolDTO): Promise<ToolDTO> => {
  const { data } = await apiClient.post<ToolDTO>('/tools', payload)
  return data
}

export const updateTool = async (
  id: string,
  payload: UpdateToolDTO,
): Promise<ToolDTO> => {
  const { data } = await apiClient.put<ToolDTO>(`/tools/${id}`, payload)
  return data
}

export const deleteTool = async (id: string): Promise<void> => {
  await apiClient.delete(`/tools/${id}`)
}

const toolService = {
  fetchTools,
  fetchToolById,
  createTool,
  updateTool,
  deleteTool,
}

export default toolService
