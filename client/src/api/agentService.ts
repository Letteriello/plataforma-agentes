import apiClient from './apiClient';
import { AnyAgentConfig } from '@/types/agent';

export const saveAgent = async (config: AnyAgentConfig): Promise<AnyAgentConfig> => {
  const { data } = config.id
    ? await apiClient.put<AnyAgentConfig>(`/agents/${config.id}`, config)
    : await apiClient.post<AnyAgentConfig>('/agents', config);
  return data;
};

export const deleteAgent = async (agentId: string): Promise<void> => {
  await apiClient.delete(`/agents/${agentId}`);
};

export const fetchAgents = async (): Promise<AnyAgentConfig[]> => {
  const { data } = await apiClient.get<AnyAgentConfig[]>('/agents');
  return data;
};
