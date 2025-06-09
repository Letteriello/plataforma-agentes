import { describe, beforeEach, test, expect } from 'vitest';
import agentService, { __resetAgents } from './agentService';
import { AgentType, LlmAgentConfig } from '@/types/agent';

beforeEach(() => {
  __resetAgents();
});

describe('agentService', () => {
  test('saveAgent creates a new agent when id is missing', async () => {
    const config: LlmAgentConfig = {
      id: '',
      name: 'New',
      type: AgentType.LLM,
      instruction: '',
      model: 'gpt',
      code_execution: false,
      planning_enabled: false,
      tools: [],
    };

    const saved = await agentService.saveAgent(config);
    const agents = await agentService.fetchAgents();
    expect(agents.find(a => a.id === saved.id)).toBeTruthy();
  });

  test('saveAgent updates existing agent', async () => {
    const [first] = await agentService.fetchAgents();
    const updated = { ...first, name: 'Updated' } as LlmAgentConfig;
    await agentService.saveAgent(updated);
    const result = await agentService.fetchAgentById(first.id);
    expect(result.name).toBe('Updated');
  });

  test('deleteAgent removes agent', async () => {
    const [first] = await agentService.fetchAgents();
    await agentService.deleteAgent(first.id);
    const agents = await agentService.fetchAgents();
    expect(agents.find(a => a.id === first.id)).toBeUndefined();
  });
});
