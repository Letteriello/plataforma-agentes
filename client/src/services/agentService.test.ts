import { vi, describe, beforeEach, test, expect } from 'vitest';
import agentService from './agentService';
import { AnyAgentConfig, AgentType, LlmAgentConfig } from '@/types/agent';
import { useAgentStore } from '@/store/agentStore';

const addAgent = vi.fn();
const updateAgent = vi.fn();
const removeAgent = vi.fn();

vi.mock('@/store/agentStore', () => ({
  useAgentStore: {
    getState: () => ({ addAgent, updateAgent, removeAgent }),
  },
}));

beforeEach(() => {
  addAgent.mockClear();
  updateAgent.mockClear();
  removeAgent.mockClear();
});

describe('agentService', () => {
  const configWithoutId: LlmAgentConfig = {
    id: '',
    name: 'New',
    type: AgentType.LLM,
    instruction: '',
    model: 'gpt',
    code_execution: false,
    planning_enabled: false,
    tools: [],
  };

  const configWithId: LlmAgentConfig = { ...configWithoutId, id: '123' };

  test('saveAgent calls addAgent when id is missing', async () => {
    await agentService.saveAgent(configWithoutId);
    expect(addAgent).toHaveBeenCalled();
    expect(updateAgent).not.toHaveBeenCalled();
  });

  test('saveAgent calls updateAgent when id exists', async () => {
    await agentService.saveAgent(configWithId);
    expect(updateAgent).toHaveBeenCalled();
    expect(addAgent).not.toHaveBeenCalled();
  });

  test('deleteAgent calls removeAgent', async () => {
    await agentService.deleteAgent('abc');
    expect(removeAgent).toHaveBeenCalledWith('abc');
  });
});
