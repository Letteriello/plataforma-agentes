import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { useAgents } from './useAgents';
import { useAgentStore } from '@/store/agentStore';
import { AgentType, AnyAgentConfig } from '@/types/agent';

vi.mock('@/store/agentStore');
const fetchAgentsMock = vi.fn();
const deleteAgentMock = vi.fn();


const mockAgents: AnyAgentConfig[] = [
  { id: '1', name: 'Agent', type: AgentType.LLM, instruction: '', model: 'gpt', code_execution: false, planning_enabled: false, tools: [] },
];

vi.mocked(useAgentStore).mockReturnValue({
  agents: [],
  fetchAgents: fetchAgentsMock,
  deleteAgent: deleteAgentMock,
});

describe('useAgents hook', () => {
  test('fetches agents on init', async () => {
    renderHook(() => useAgents());
    await waitFor(() => expect(fetchAgentsMock).toHaveBeenCalled());
  });

  test('deleteAgent calls service', async () => {
    const { result } = renderHook(() => useAgents());
    await result.current.deleteAgent('1');
    expect(deleteAgentMock).toHaveBeenCalledWith('1');
  });
});
