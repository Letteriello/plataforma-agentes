import { describe, beforeEach, test, expect, vi } from 'vitest';
import agentService from './agentService';
import apiClient from '@/api/apiClient';
import { AgentType, LlmAgentConfig } from '@/types/agent';

vi.mock('@/api/apiClient');

const mockedApi = apiClient as unknown as {
  get: any;
  post: any;
  put: any;
  delete: any;
};

beforeEach(() => {
  mockedApi.get = vi.fn();
  mockedApi.post = vi.fn();
  mockedApi.put = vi.fn();
  mockedApi.delete = vi.fn();
});

describe('agentService', () => {
  const agent: LlmAgentConfig = {
    id: '123',
    name: 'Test',
    type: AgentType.LLM,
    instruction: '',
    model: 'gpt',
    code_execution: false,
    planning_enabled: false,
    tools: [],
  };

  test('fetchAgents returns data', async () => {
    mockedApi.get.mockResolvedValue({ data: [agent] });
    const result = await agentService.fetchAgents();
    expect(mockedApi.get).toHaveBeenCalledWith('/agents');
    expect(result).toEqual([agent]);
  });

  test('saveAgent creates when id missing', async () => {
    mockedApi.post.mockResolvedValue({ data: agent });
    const result = await agentService.saveAgent({ ...agent, id: '' });
    expect(mockedApi.post).toHaveBeenCalledWith('/agents', { ...agent, id: '' });
    expect(result).toEqual(agent);
  });

  test('saveAgent updates when id exists', async () => {
    mockedApi.put.mockResolvedValue({ data: agent });
    const result = await agentService.saveAgent(agent);
    expect(mockedApi.put).toHaveBeenCalledWith(`/agents/${agent.id}`, agent);
    expect(result).toEqual(agent);
  });

  test('deleteAgent calls API', async () => {
    mockedApi.delete.mockResolvedValue({});
    await agentService.deleteAgent(agent.id);
    expect(mockedApi.delete).toHaveBeenCalledWith(`/agents/${agent.id}`);
  });
});
