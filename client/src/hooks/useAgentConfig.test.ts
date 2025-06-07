import { renderHook, act } from '@testing-library/react';
import { useAgentConfig } from './useAgentConfig';
import { AgentType, LlmAgentConfig } from '@/types/agent';

describe('useAgentConfig hook', () => {
  const initial: LlmAgentConfig = {
    id: '1',
    name: 'Agent',
    type: AgentType.LLM,
    instruction: 'test',
    model: 'gpt',
    code_execution: false,
    planning_enabled: false,
    tools: [],
  };

  test('initializes with config', () => {
    const { result } = renderHook(() => useAgentConfig({ initialConfig: initial }));
    expect(result.current.config).toEqual(initial);
  });

  test('updateField updates value', () => {
    const { result } = renderHook(() => useAgentConfig({ initialConfig: initial }));
    act(() => {
      result.current.updateField('name', 'New');
    });
    expect(result.current.config.name).toBe('New');
  });

  test('addTool and removeTool modify tools', () => {
    const { result } = renderHook(() => useAgentConfig({ initialConfig: initial }));
    act(() => {
      result.current.addTool('tool1');
    });
    expect(result.current.config.tools).toContain('tool1');
    act(() => {
      result.current.removeTool('tool1');
    });
    expect(result.current.config.tools).not.toContain('tool1');
  });

  test('reset restores initial config', () => {
    const { result } = renderHook(() => useAgentConfig({ initialConfig: initial }));
    act(() => {
      result.current.updateField('name', 'Changed');
      result.current.reset();
    });
    expect(result.current.config.name).toBe(initial.name);
  });
});
