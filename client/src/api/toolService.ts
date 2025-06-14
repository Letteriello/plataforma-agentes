import api from './apiClient';

// Basic Tool Parameter Schema
export interface ToolParameter {
  id?: string;
  name: string;
  description: string;
  type: 'string' | 'number' | 'boolean';
  required: boolean;
  default_value?: string | number | boolean;
}

// Base interface for a tool
export interface Tool {
  id: string;
  name: string;
  description: string;
  type: 'custom_api' | 'other_type'; // Extend with other tool types as needed
  is_system_tool: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
  parameters: ToolParameter[];
  // For custom_api tools
  api_endpoint?: string;
  api_method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  api_headers?: Record<string, string | number | boolean>;
}

// Schema for creating a new tool
export interface ToolCreateSchema {
  name: string;
  description: string;
  type: 'custom_api'; // Currently only supporting this type for creation
  api_endpoint: string;
  api_method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  api_headers?: Record<string, string | number | boolean>;
  parameters: Omit<ToolParameter, 'id'>[];
}

// Schema for updating a tool
export type ToolUpdateSchema = Partial<Omit<ToolCreateSchema, 'type'>>;

export interface PaginatedTools {
  items: Tool[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

/**
 * Fetches a paginated list of tools.
 * @param page - The page number to fetch.
 * @param size - The number of items per page.
 * @param userOwnedOnly - Whether to fetch only tools owned by the user.
 * @returns A paginated list of tools.
 */
export const getTools = async (page = 1, size = 20, userOwnedOnly = true): Promise<PaginatedTools> => {
  const params = new URLSearchParams({
    page: String(page),
    size: String(size),
    user_owned_only: String(userOwnedOnly),
    include_system_tools: String(!userOwnedOnly),
  });
  const response = await api.get<PaginatedTools>(`/tools/?${params.toString()}`);
  return response.data;
};

/**
 * Fetches a single tool by its ID.
 * @param toolId - The ID of the tool to fetch.
 * @returns The tool data.
 */
export const getToolById = async (toolId: string): Promise<Tool> => {
  const response = await api.get<Tool>(`/tools/${toolId}`);
  return response.data;
};

/**
 * Creates a new custom tool.
 * @param toolData - The data for the new tool.
 * @returns The created tool data.
 */
export const createTool = async (toolData: ToolCreateSchema): Promise<Tool> => {
  const response = await api.post<Tool>('/tools/', toolData);
  return response.data;
};

/**
 * Updates an existing tool.
 * @param toolId - The ID of the tool to update.
 * @param toolData - The new data for the tool.
 * @returns The updated tool data.
 */
export const updateTool = async (toolId: string, toolData: ToolUpdateSchema): Promise<Tool> => {
  const response = await api.put<Tool>(`/tools/${toolId}`, toolData);
  return response.data;
};

/**
 * Deletes a tool.
 * @param toolId - The ID of the tool to delete.
 */
export const deleteTool = async (toolId: string): Promise<void> => {
  await api.delete(`/tools/${toolId}`);
};
