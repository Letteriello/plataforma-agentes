import apiClient from '../apiClient';
import { AnyAgentConfig, AgentCategory } from '@/types'; // Assuming AgentCategory might be needed based on original plan

export interface IAgentService {
  /** Retorna a lista de agentes */
  fetchAgents(): Promise<AnyAgentConfig[]>;
  /** Busca um agente pelo id */
  fetchAgentById(agentId: string): Promise<AnyAgentConfig | null>; // Can return null if not found
  /** Cria um novo agente */
  createAgent(config: Omit<AnyAgentConfig, 'id'>): Promise<AnyAgentConfig>;
  /** Atualiza um agente existente */
  updateAgent(agentId: string, config: Partial<AnyAgentConfig>): Promise<AnyAgentConfig>;
  /** Remove um agente */
  deleteAgent(agentId: string): Promise<void>;
  /** Retorna as categorias de agentes */
  fetchAgentCategories(): Promise<AgentCategory[]>; // As per original plan
  /** Busca agentes por um termo */
  searchAgents(query: string): Promise<AnyAgentConfig[]>; // As per original plan
}

export const agentService: IAgentService = {
  async fetchAgents(): Promise<AnyAgentConfig[]> {
    const response = await apiClient.get<AnyAgentConfig[]>('/agents');
    return response.data;
  },

  async fetchAgentById(agentId: string): Promise<AnyAgentConfig | null> {
    try {
      const response = await apiClient.get<AnyAgentConfig>(`/agents/${agentId}`);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        return null; // Explicitly return null for 404
      }
      throw error; // Re-throw other errors
    }
  },

  async createAgent(config: Omit<AnyAgentConfig, 'id'>): Promise<AnyAgentConfig> {
    const response = await apiClient.post<AnyAgentConfig>('/agents', config);
    return response.data;
  },

  async updateAgent(agentId: string, config: Partial<AnyAgentConfig>): Promise<AnyAgentConfig> {
    const response = await apiClient.put<AnyAgentConfig>(`/agents/${agentId}`, config);
    return response.data;
  },

  async deleteAgent(agentId: string): Promise<void> {
    await apiClient.delete(`/agents/${agentId}`);
  },

  async fetchAgentCategories(): Promise<AgentCategory[]> {
    // Assuming AgentCategory is a simple type like { id: string; name: string; }
    const response = await apiClient.get<AgentCategory[]>('/agent-categories');
    return response.data;
  },

  async searchAgents(query: string): Promise<AnyAgentConfig[]> {
    const response = await apiClient.get<AnyAgentConfig[]>('/agents/search', { params: { query } });
    return response.data;
  },
};

export default agentService;
