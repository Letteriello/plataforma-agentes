import apiClient from './apiClient';
import type { AxiosResponse } from 'axios';

// --- Enums ---
export type ToolType = 'TOOL_CODE' | 'API';

// --- Tool Parameter DTOs ---
export interface ToolParameterDTO {
  id: string; // UUID
  tool_id: string; // UUID
  name: string;
  type: string;
  description?: string | null;
  default_value?: string | null;
  is_required: boolean;
  created_at: string; // ISO datetime string
}

export interface ToolParameterCreateDTO {
  name: string;
  type: string;
  description?: string | null;
  default_value?: string | null;
  is_required: boolean;
}

// --- Tool DTOs ---
export interface ToolDTO {
  id: string; // UUID
  user_id?: string | null; // UUID, null for system tools
  name: string;
  description?: string | null;
  tool_type: ToolType;
  api_endpoint?: string | null;
  return_type_schema?: Record<string, any> | null;
  is_system_tool: boolean;
  created_at: string; // ISO datetime string
  updated_at: string; // ISO datetime string
  parameters: ToolParameterDTO[];
}

export interface CreateToolDTO {
  name: string;
  description?: string | null;
  tool_type: ToolType;
  api_endpoint?: string | null;
  return_type_schema?: Record<string, any> | null;
  parameters: ToolParameterCreateDTO[];
}

export interface UpdateToolDTO {
  name?: string;
  description?: string | null;
  tool_type?: ToolType;
  api_endpoint?: string | null;
  return_type_schema?: Record<string, any> | null;
  parameters?: ToolParameterCreateDTO[];
}

export interface PaginatedToolsDTO {
  items: ToolDTO[];
  total: number;
  page: number;
  size: number;
  total_pages: number;
}

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

export default {
  getTools,
  getToolById,
  createTool,
  updateTool,
  deleteTool,
};
