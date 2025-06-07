import { vi, describe, beforeEach, test, expect } from 'vitest';
import { saveAgent } from './agentService';
import { AnyAgentConfig, AgentType, LlmAgentConfig } from '@/types/agent';
import { useAgentStore } from '@/store/agentStore';

const addAgent = vi.fn();
const updateAgent = vi.fn();

vi.mock('@/store/agentStore', () => ({
  useAgentStore: {
    getState: () => ({ addAgent, updateAgent }),
  },
}));

beforeEach(() => {
  addAgent.mockClear();
  updateAgent.mockClear();
});

describe('agentService.saveAgent', () => {
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

  const configWithId: LlmAgentConfig = {
    ...configWithoutId,
    id: '123',
  };

  test('calls addAgent when id is missing', async () => {
    await saveAgent(configWithoutId);
    expect(addAgent).toHaveBeenCalled();
    expect(updateAgent).not.toHaveBeenCalled();
  });

  test('calls updateAgent when id exists', async () => {
    await saveAgent(configWithId);
    expect(updateAgent).toHaveBeenCalled();
    expect(addAgent).not.toHaveBeenCalled();
  });
});
