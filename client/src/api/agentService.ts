import apiClient from '@/api/apiClient';
import type { LlmAgentConfig, UiToolDefinition } from '@/types/agents';
import type { ToolDTO, ToolParameterDTO } from './toolService';

// Base DTOs that match the backend Pydantic Schemas
// This represents the ToolParameter as expected by the backend in requests/responses.
interface ToolParameterPayload extends Omit<ToolParameterDTO, 'tool_id' | 'created_at'> {}

// This represents the Tool as expected by the backend in requests/responses.
interface ToolPayload extends Omit<ToolDTO, 'parameters'> {
  parameters: ToolParameterPayload[];
}

/**
 * DTO for an agent in a list view (summary).
 */
export interface AgentSummaryDTO {
  id: string;
  name: string;
  description?: string;
  // Assuming 'model' is a better field to show than a generic 'type'
  model: string;
}

/**
 * DTO for the detailed view of an agent, matching the backend's response model.
 */
export interface AgentDetailDTO extends Omit<LlmAgentConfig, 'tools'> {
  tools: ToolPayload[]; // The backend returns the full tool objects
}

/**
 * DTO for creating a new agent. This is the payload sent to the backend.
 * It mirrors the backend's Agent Pydantic model.
 */
export interface CreateAgentPayload extends Omit<LlmAgentConfig, 'id' | 'tools'> {
  tools: ToolPayload[];
  knowledge_base_ids: string[];
}

/**
 * DTO for updating an agent.
 */
export type UpdateAgentPayload = Partial<CreateAgentPayload>;

/**
 * Fetches a list of all agents (summary view).
 */
export const fetchAgents = async (): Promise<AgentSummaryDTO[]> => {
  const { data } = await apiClient.get<AgentSummaryDTO[]>('/agents')
  return data
}

/**
 * Fetches the detailed configuration of a single agent by its ID.
 */
export const fetchAgentById = async (id:string): Promise<LlmAgentConfig> => {
  const { data } = await apiClient.get<AgentDetailDTO>(`/agents/${id}`);

  // The backend sends the full tool objects. We need to map them to UiToolDefinition
  // for the form to use them correctly (especially the 'type' field).
  const toolsForUi: UiToolDefinition[] = data.tools.map(toolPayload => ({
    ...toolPayload,
    type: toolPayload.is_system_tool ? 'system' : 'custom',
  }));

  return {
    ...data,
    tools: toolsForUi,
  };
};

/**
 * Creates a new agent with the given configuration.
 */
export const createAgent = async (
  payload: LlmAgentConfig,
): Promise<AgentDetailDTO> => {
  // Transform the form's UiToolDefinition into the backend's ToolPayload
  const toolsForApi: ToolPayload[] = payload.tools.map(uiTool => {
    const { type, ...apiTool } = uiTool; // Exclude the 'type' field not present in backend model
    return apiTool;
  });

  const apiPayload: CreateAgentPayload = {
    ...payload,
    tools: toolsForApi,
    knowledge_base_ids: payload.knowledgeBaseIds || [],
  };

  const { data } = await apiClient.post<AgentDetailDTO>('/agents', apiPayload);
  return data;
};

/**
 * Updates an existing agent's configuration.
 */
export const updateAgent = async (
  id: string,
  payload: Partial<LlmAgentConfig>,
): Promise<AgentDetailDTO> => {
  // Transform tools if they are part of the payload
  const toolsForApi = payload.tools?.map(uiTool => {
    const { type, ...apiTool } = uiTool;
    return apiTool;
  });

  const apiPayload: UpdateAgentPayload = {
    ...payload,
    tools: toolsForApi,
    knowledge_base_ids: payload.knowledgeBaseIds,
  };

  const { data } = await apiClient.patch<AgentDetailDTO>(`/agents/${id}`, apiPayload);
  return data;
};

export const deleteAgent = async (id: string): Promise<void> => {
  await apiClient.delete(`/agents/${id}`)
}

/**
 * Associates a tool with an agent.
 */
export const associateToolWithAgent = async (
  agentId: string,
  toolId: string,
): Promise<any> => { // The backend returns a Dict[str, Any] which can be { message: string, association: object }
  const { data } = await apiClient.post(`/agents/${agentId}/tools/${toolId}`);
  return data;
};

/**
 * Disassociates a tool from an agent.
 */
export const disassociateToolFromAgent = async (
  agentId: string,
  toolId: string,
): Promise<any> => { // The backend returns a Dict[str, str] which can be { message: string }
  const { data } = await apiClient.delete(`/agents/${agentId}/tools/${toolId}`);
  return data;
};

/**
 * Fetches all tools associated with a specific agent.
 */
export const getAgentTools = async (agentId: string): Promise<ToolDTO[]> => {
  const { data } = await apiClient.get<ToolDTO[]>(`/agents/${agentId}/tools`);
  return data;
};

export default {
  fetchAgents,
  fetchAgentById,
  createAgent,
  updateAgent,
  deleteAgent,
  associateToolWithAgent, // Added
  disassociateToolFromAgent, // Added
  getAgentTools, // Added
};
