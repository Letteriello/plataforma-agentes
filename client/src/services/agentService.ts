import apiClient from '@/api/apiClient';
import { AnyAgentConfig } from '@/types';

export interface IAgentService {
  fetchAgents(): Promise<AnyAgentConfig[]>;
  fetchAgentById(agentId: string): Promise<AnyAgentConfig>;
  saveAgent(config: AnyAgentConfig): Promise<AnyAgentConfig>;
  deleteAgent(agentId: string): Promise<void>;
}

export const agentService: IAgentService = {
  async fetchAgents() {
    const res = await apiClient.get<AnyAgentConfig[]>('/agents');
    return res.data;
  },

  async fetchAgentById(agentId: string) {
    const res = await apiClient.get<AnyAgentConfig>(`/agents/${agentId}`);
    return res.data;
  },

  async saveAgent(config: AnyAgentConfig) {
    if (config.id && config.id !== '') {
      const res = await apiClient.put<AnyAgentConfig>(`/agents/${config.id}`, config);
      return res.data;
    }
    const res = await apiClient.post<AnyAgentConfig>('/agents', config);
    return res.data;
  },

  async deleteAgent(agentId: string) {
    await apiClient.delete(`/agents/${agentId}`);
  },
};

export default agentService;
