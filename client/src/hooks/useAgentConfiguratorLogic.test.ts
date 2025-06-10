import { renderHook, act } from '@testing-library/react';
import { useAgentConfiguratorLogic } from './useAgentConfiguratorLogic';
import { useAgentConfig } from '@/hooks/useAgentConfig';
import { AgentType, AnyAgentConfig, LlmAgentConfig, SequentialAgentConfig, ParallelAgentConfig, LoopAgentConfig, createDefaultAgentConfig } from '@/types/core/agent';
import { createNewAgentConfig } from '@/lib/agent-utils';
import { vi } from 'vitest';

// Mock dependencies
vi.mock('@/hooks/useAgentConfig');
vi.mock('@/lib/agent-utils', async (importOriginal) => {
  const original = await importOriginal<typeof import('@/lib/agent-utils')>();
  return {
    ...original,
    createNewAgentConfig: vi.fn((type, id, name) => ({ // Simple mock for createNewAgentConfig
      id: id || `agent-${Date.now()}`,
      name: name || `New ${type} Agent`,
      type,
      version: '1.0.0',
      ...(type === AgentType.LLM && { model: 'default-model', instruction: '', tools: [], planningEnabled: false, codeExecution: false, temperature: 0.5, topK: 1, topP: 1 }),
      ...(type === AgentType.SEQUENTIAL && { agents: [] }),
      ...(type === AgentType.PARALLEL && { agents: [] }),
      ...(type === AgentType.LOOP && { agent: null, maxIterations: 10 }),
    })),
  };
});


// Mock data for sub-agent selection
const mockExistingAgentsList: AnyAgentConfig[] = [
  { ...(createDefaultAgentConfig(AgentType.LLM) as LlmAgentConfig), id: 'sub-agent-1', name: 'Sub Agent 1'},
  { ...(createDefaultAgentConfig(AgentType.LLM) as LlmAgentConfig), id: 'sub-agent-2', name: 'Sub Agent 2'},
];


describe('useAgentConfiguratorLogic', () => {
  let mockUseAgentConfigReturn: {
    config: AnyAgentConfig;
    updateConfig: vi.Mock;
    updateField: vi.Mock;
  };

  const initialLogicHookConfig = createDefaultAgentConfig(AgentType.LLM) as LlmAgentConfig;
  initialLogicHookConfig.id = 'llm-config-1';
  initialLogicHookConfig.name = 'Test LLM Logic';
  initialLogicHookConfig.instruction = 'Test Instruction';
  initialLogicHookConfig.tools = ['tool1', 'tool2'] as any[];

  beforeEach(() => {
    vi.clearAllMocks();
    // Ensure a fresh config object for each test to avoid shared state issues from `initialLogicHookConfig`
    const freshInitialConfig = {
        ...createDefaultAgentConfig(AgentType.LLM) as LlmAgentConfig,
        id: 'llm-config-1',
        name: 'Test LLM Logic',
        instruction: 'Test Instruction',
        tools: ['tool1', 'tool2'] as any[],
    };
    mockUseAgentConfigReturn = {
      config: JSON.parse(JSON.stringify(freshInitialConfig)),
      updateConfig: vi.fn(),
      updateField: vi.fn(),
    };
    (useAgentConfig as vi.Mock).mockReturnValue(mockUseAgentConfigReturn);
  });

  const renderHelper = (initialConfOverride?: AnyAgentConfig, onSaveMock?: vi.Mock, isSavingGlobal = false) => {
    const currentInitialConfig = initialConfOverride ? JSON.parse(JSON.stringify(initialConfOverride)) : JSON.parse(JSON.stringify(initialLogicHookConfig));

    mockUseAgentConfigReturn.config = currentInitialConfig; // Update the config in the shared mock object
     (useAgentConfig as vi.Mock).mockReturnValue(mockUseAgentConfigReturn); // Ensure the mock returns the potentially updated config

    const initialProps = {
      initialAgentConfig: currentInitialConfig, // Pass the same config to the hook's props
      onSave: onSaveMock || vi.fn(),
      isSavingGlobal,
    };
    return renderHook((props) => useAgentConfiguratorLogic(props), { initialProps });
  };


  it('should initialize with config from useAgentConfig', () => {
    const { result } = renderHelper();
    expect(result.current.config).toEqual(initialLogicHookConfig);
    expect(result.current.llmConfig).toEqual(initialLogicHookConfig);
    expect(result.current.sequentialConfig).toBeNull();
  });

  it('handleInputChange should call updateField', () => {
    const { result } = renderHelper();
    const event = { target: { name: 'name', value: 'New Agent Name' } } as React.ChangeEvent<HTMLInputElement>;
    act(() => result.current.handleInputChange(event));
    expect(mockUseAgentConfigReturn.updateField).toHaveBeenCalledWith('name', 'New Agent Name');
  });

  it('handleLlmInputChange should call updateField for LLM agents', () => {
    const { result } = renderHelper(); // Initial is LLM
    const event = { target: { name: 'model', value: 'gpt-4' } } as React.ChangeEvent<HTMLInputElement>;
    act(() => result.current.handleLlmInputChange(event));
    expect(mockUseAgentConfigReturn.updateField).toHaveBeenCalledWith('model', 'gpt-4');
  });

  it('handleLlmInputChange should not call updateField for non-LLM agents', () => {
    const nonLlmConfig = createDefaultAgentConfig(AgentType.SEQUENTIAL);
    const { result } = renderHelper(nonLlmConfig); // Correctly re-renders with new config
    const event = { target: { name: 'model', value: 'gpt-4' } } as React.ChangeEvent<HTMLInputElement>;
    act(() => result.current.handleLlmInputChange(event));
    expect(mockUseAgentConfigReturn.updateField).not.toHaveBeenCalled();
  });

  it('handleSliderChange should call updateField for LLM agents', () => {
    const { result } = renderHelper(); // LLM
    act(() => result.current.handleSliderChange(0.8, 'temperature'));
    expect(mockUseAgentConfigReturn.updateField).toHaveBeenCalledWith('temperature', 0.8);
  });

   it('handleSliderChange should not call updateField for non-LLM agents', () => {
    const nonLlmConfig = createDefaultAgentConfig(AgentType.A2A);
    const { result } = renderHelper(nonLlmConfig);
    act(() => result.current.handleSliderChange(0.8, 'temperature'));
    expect(mockUseAgentConfigReturn.updateField).not.toHaveBeenCalled();
  });

  it('handleTypeChange should call createNewAgentConfig and updateConfig', () => {
    const { result } = renderHelper();
    const newType = AgentType.SEQUENTIAL;
    const expectedNewConfig = { id: initialLogicHookConfig.id, name: initialLogicHookConfig.name, type: newType, version: '1.0.0', agents: [] };
    (createNewAgentConfig as vi.Mock).mockReturnValue(expectedNewConfig);

    act(() => result.current.handleTypeChange(newType));

    expect(createNewAgentConfig).toHaveBeenCalledWith(newType, initialLogicHookConfig.id, initialLogicHookConfig.name);
    expect(mockUseAgentConfigReturn.updateConfig).toHaveBeenCalledWith(expectedNewConfig);
  });

  it('handleSwitchChange should call updateField for LLM agents', () => {
    const { result } = renderHelper(); // LLM
    act(() => result.current.handleSwitchChange(true, 'planningEnabled'));
    expect(mockUseAgentConfigReturn.updateField).toHaveBeenCalledWith('planningEnabled', true);
  });

  it('handleSwitchChange should not call updateField for non-LLM agents', () => {
    const nonLlmConfig = createDefaultAgentConfig(AgentType.A2A);
    const { result } = renderHelper(nonLlmConfig);
    act(() => result.current.handleSwitchChange(true, 'planningEnabled' as any)); // Cast as LlmAgentConfig field might not exist on A2A
    expect(mockUseAgentConfigReturn.updateField).not.toHaveBeenCalled();
  });


  it('handleToolsSelectionChange should update tools for LLM agents', () => {
    const { result } = renderHelper(); // LLM agent
    const newToolIds = ['tool3', 'tool4'];
    act(() => result.current.handleToolsSelectionChange(newToolIds));
    expect(mockUseAgentConfigReturn.updateField).toHaveBeenCalledWith('tools', newToolIds);
  });

  it('handleRemoveSelectedTool should update tools for LLM agents', () => {
    const { result } = renderHelper(); // LLM agent with tools: ['tool1', 'tool2']
    act(() => result.current.handleRemoveSelectedTool('tool1'));
    expect(mockUseAgentConfigReturn.updateField).toHaveBeenCalledWith('tools', ['tool2']);
  });

  it('handleRemoveSelectedTool should do nothing if tool not found or tools array is undefined', () => {
    const configWithoutTools = {...initialLogicHookConfig, tools: undefined } as LlmAgentConfig;
    const { result } = renderHelper(configWithoutTools);
    act(() => result.current.handleRemoveSelectedTool('tool-nonexistent'));
    expect(mockUseAgentConfigReturn.updateField).not.toHaveBeenCalled(); // Or called with undefined if it initializes
  });


  it('handleAddSubAgentToWorkflowByIds should add unique agents to Sequential agent', () => {
    const initialSequentialConfig = createDefaultAgentConfig(AgentType.SEQUENTIAL) as SequentialAgentConfig;
    initialSequentialConfig.id = 'seq-1';
    initialSequentialConfig.name = 'My Sequential';
    initialSequentialConfig.agents = [mockExistingAgentsList[0]];

    const { result } = renderHelper(initialSequentialConfig);
    result.current.localMockExistingAgents = mockExistingAgentsList; // Ensure hook uses our mock list

    act(() => result.current.handleAddSubAgentToWorkflowByIds(['sub-agent-2', 'sub-agent-1']));

    const expectedAgents = [mockExistingAgentsList[0], mockExistingAgentsList[1]];
    expect(mockUseAgentConfigReturn.updateField).toHaveBeenCalledWith('agents', expectedAgents);
    expect(result.current.isAddSubAgentModalOpen).toBe(false);
    expect(result.current.selectedAgentIdsForModal).toEqual([]);
  });

  it('handleRemoveSubAgentFromWorkflow should remove agent from Sequential agent', () => {
    const initialSequentialConfig = createDefaultAgentConfig(AgentType.SEQUENTIAL) as SequentialAgentConfig;
    initialSequentialConfig.agents = [mockExistingAgentsList[0], mockExistingAgentsList[1]];
    const { result } = renderHelper(initialSequentialConfig);

    act(() => result.current.handleRemoveSubAgentFromWorkflow('sub-agent-1'));
    expect(mockUseAgentConfigReturn.updateField).toHaveBeenCalledWith('agents', [mockExistingAgentsList[1]]);
  });

  it('handleSubAgentsOrderChange should update agents field for Sequential agent', () => {
    const initialSequentialConfig = createDefaultAgentConfig(AgentType.SEQUENTIAL) as SequentialAgentConfig;
    initialSequentialConfig.agents = [mockExistingAgentsList[0], mockExistingAgentsList[1]];
    const { result } = renderHelper(initialSequentialConfig);
    const newOrder = [mockExistingAgentsList[1], mockExistingAgentsList[0]];
    act(() => result.current.handleSubAgentsOrderChange(newOrder));
    expect(mockUseAgentConfigReturn.updateField).toHaveBeenCalledWith('agents', newOrder);
  });

  it('handleLoopAgentChange should update agent field for Loop agent', () => {
    const initialLoopConfig = createDefaultAgentConfig(AgentType.LOOP) as LoopAgentConfig;
    const { result } = renderHelper(initialLoopConfig);
    result.current.localMockExistingAgents = mockExistingAgentsList;

    act(() => result.current.handleLoopAgentChange('sub-agent-1'));
    expect(mockUseAgentConfigReturn.updateField).toHaveBeenCalledWith('agent', mockExistingAgentsList[0]);
  });


  it('handleSavePress should call onSave prop with current config', async () => {
    const onSaveMock = vi.fn();
    const { result } = renderHelper(initialLogicHookConfig, onSaveMock);
    await act(async () => { await result.current.handleSavePress(); });
    expect(onSaveMock).toHaveBeenCalledWith(initialLogicHookConfig);
  });

  describe('isSaveDisabled', () => {
    it('should be true if name is empty', () => {
      const { result } = renderHelper({ ...initialLogicHookConfig, name: '' });
      expect(result.current.isSaveDisabled).toBe(true);
    });

    it('should be true for LLM if instruction is empty', () => {
      const { result } = renderHelper({ ...initialLogicHookConfig, type: AgentType.LLM, instruction: '' } as LlmAgentConfig);
      expect(result.current.isSaveDisabled).toBe(true);
    });

    it('should be true for Sequential if agents list is empty', () => {
      const config = { ...(createDefaultAgentConfig(AgentType.SEQUENTIAL) as SequentialAgentConfig), name: "Seq Agent", agents: [] };
      const { result } = renderHelper(config);
      expect(result.current.isSaveDisabled).toBe(true);
    });

    it('should be true for Parallel if agents list is empty', () => {
      const config = { ...(createDefaultAgentConfig(AgentType.PARALLEL) as ParallelAgentConfig), name: "Parallel Agent", agents: [] };
      const { result } = renderHelper(config);
      expect(result.current.isSaveDisabled).toBe(true);
    });

    it('should be true for Loop if agent is not set', () => {
      const config = { ...(createDefaultAgentConfig(AgentType.LOOP) as LoopAgentConfig), name: "Loop Agent", agent: null };
      const { result } = renderHelper(config);
      expect(result.current.isSaveDisabled).toBe(true);
    });

    it('should be false if config is valid LLM', () => {
      const { result } = renderHelper(initialLogicHookConfig); // Valid by default
      expect(result.current.isSaveDisabled).toBe(false);
    });

    it('should be true if isSavingGlobal is true', () => {
      const { result } = renderHelper(initialLogicHookConfig, vi.fn(), true);
      expect(result.current.isSaveDisabled).toBe(true);
    });
  });

  it('handleAgentSelectionForModal should toggle agent ID in selectedAgentIdsForModal', () => {
    const { result } = renderHelper();
    act(() => result.current.handleAgentSelectionForModal('agent1'));
    expect(result.current.selectedAgentIdsForModal).toEqual(['agent1']);
    act(() => result.current.handleAgentSelectionForModal('agent2'));
    expect(result.current.selectedAgentIdsForModal).toEqual(['agent1', 'agent2']);
    act(() => result.current.handleAgentSelectionForModal('agent1'));
    expect(result.current.selectedAgentIdsForModal).toEqual(['agent2']);
  });

  it('should correctly set isToolSelectorOpen and isAddSubAgentModalOpen', () => {
    const { result } = renderHelper();
    expect(result.current.isToolSelectorOpen).toBe(false);
    act(() => result.current.setIsToolSelectorOpen(true));
    expect(result.current.isToolSelectorOpen).toBe(true);

    expect(result.current.isAddSubAgentModalOpen).toBe(false);
    act(() => result.current.setIsAddSubAgentModalOpen(true));
    expect(result.current.isAddSubAgentModalOpen).toBe(true);
  });

});
