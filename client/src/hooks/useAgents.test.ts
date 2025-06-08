import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { useAgents } from './useAgents';
import agentService from '@/services/agentService';
import { useAgentStore } from '@/store/agentStore';
import { AgentType, AnyAgentConfig } from '@/types/agent';

vi.mock('@/services/agentService');
vi.mock('@/store/agentStore');

const fetchAgentsMock = agentService.fetchAgents as unknown as vi.Mock;
const deleteAgentMock = agentService.deleteAgent as unknown as vi.Mock;

const loadAgents = vi.fn();

const mockAgents: AnyAgentConfig[] = [
  { id: '1', name: 'Agent', type: AgentType.LLM, instruction: '', model: 'gpt', code_execution: false, planning_enabled: false, tools: [] },
];

vi.mocked(useAgentStore).mockReturnValue({ agents: [], loadAgents });

fetchAgentsMock.mockResolvedValue(mockAgents);
deleteAgentMock.mockResolvedValue(undefined);

describe('useAgents hook', () => {
  test('fetches agents on init', async () => {
    renderHook(() => useAgents());
    await waitFor(() => expect(fetchAgentsMock).toHaveBeenCalled());
    expect(loadAgents).toHaveBeenCalledWith(mockAgents);
  });

  test('deleteAgent calls service', async () => {
    const { result } = renderHook(() => useAgents());
    await result.current.deleteAgent('1');
    expect(deleteAgentMock).toHaveBeenCalledWith('1');
  });
});
