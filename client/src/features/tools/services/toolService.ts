import type { AxiosResponse } from 'axios';

import {
  CreateToolDTO,
  PaginatedToolsDTO,
  ToolDTO,
  UpdateToolDTO,
} from '@/features/tools/types';

import apiClient from '@/api/apiClient';

// --- Service Functions ---

/**
 * Fetches a paginated list of tools.
 */
export const getTools = async (params: {
  page?: number;
  size?: number;
  includeSystemTools?: boolean;
}): Promise<PaginatedToolsDTO> => {
  const response: AxiosResponse<PaginatedToolsDTO> = await apiClient.get('/tools', {
    params: {
      page: params.page,
      size: params.size,
      include_system_tools: params.includeSystemTools,
    },
  });
  return response.data;
};

/**
 * Fetches a single tool by its ID.
 */
export const getToolById = async (toolId: string): Promise<ToolDTO> => {
  const response: AxiosResponse<ToolDTO> = await apiClient.get(`/tools/${toolId}`);
  return response.data;
};

/**
 * Creates a new tool.
 */
export const createTool = async (payload: CreateToolDTO): Promise<ToolDTO> => {
  const response: AxiosResponse<ToolDTO> = await apiClient.post('/tools', payload);
  return response.data;
};

/**
 * Updates an existing tool.
 */
export const updateTool = async (
  toolId: string,
  payload: UpdateToolDTO,
): Promise<ToolDTO> => {
  const response: AxiosResponse<ToolDTO> = await apiClient.put(`/tools/${toolId}`, payload);
  return response.data;
};

/**
 * Deletes a tool by its ID.
 */
export const deleteTool = async (toolId: string): Promise<void> => {
  await apiClient.delete(`/tools/${toolId}`);
};


