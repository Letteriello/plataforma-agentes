import { useAgentConfigStore } from './agentConfigStore';
import { AnyAgentConfig, AgentType } from '@/types/core/agent'; // Using core types

// Helper to get a clean initial state for the store before each test
const getInitialState = () => ({
  currentConfig: null,
  isDirty: false,
  isLoading: false, // Though not explicitly tested, it's part of state
});

describe('agentConfigStore', () => {
  beforeEach(() => {
    // Reset the store to its defined initial state
    useAgentConfigStore.setState(getInitialState());
  });

  const sampleConfig: AnyAgentConfig = {
    id: 'cfg-123',
    name: 'Test Config',
    type: AgentType.LLM, // Assuming AgentType.LLM is 'llm'
    version: '1.0',
    // Add other required fields for a base LLM agent if necessary for type AnyAgentConfig
    model: 'test-model',
    instruction: 'test-instruction',
  };

  it('should initialize with correct default state', () => {
    const { currentConfig, isDirty, isLoading } = useAgentConfigStore.getState();
    expect(currentConfig).toBeNull();
    expect(isDirty).toBe(false);
    expect(isLoading).toBe(false);
  });

  it('setConfig should set currentConfig and reset isDirty', () => {
    const { setConfig, updateField } = useAgentConfigStore.getState();

    // Make it dirty first to ensure setConfig resets it
    setConfig(sampleConfig); // Set an initial config
    updateField('name', 'Temporary Name'); // This will make isDirty true
    expect(useAgentConfigStore.getState().isDirty).toBe(true);

    const newConfig: AnyAgentConfig = { ...sampleConfig, id: 'cfg-456', name: 'New Test Config' };
    setConfig(newConfig);

    const state = useAgentConfigStore.getState();
    expect(state.currentConfig).toEqual(newConfig);
    expect(state.isDirty).toBe(false);
  });

  it('setConfig should set currentConfig to null', () => {
    const { setConfig } = useAgentConfigStore.getState();
    // Set a config first
    setConfig(sampleConfig);
    expect(useAgentConfigStore.getState().currentConfig).not.toBeNull();

    // Set to null
    setConfig(null);
    const state = useAgentConfigStore.getState();
    expect(state.currentConfig).toBeNull();
    expect(state.isDirty).toBe(false);
  });


  it('updateField should update a field in currentConfig and set isDirty to true', () => {
    const { setConfig, updateField } = useAgentConfigStore.getState();
    setConfig(sampleConfig); // Initialize with a config

    const newName = 'Updated Config Name';
    updateField('name', newName);

    const state = useAgentConfigStore.getState();
    expect(state.currentConfig?.name).toBe(newName);
    expect(state.isDirty).toBe(true);

    // Update another field
    const newModel = 'gpt-4';
    updateField('model', newModel);
    const updatedState = useAgentConfigStore.getState();
    expect((updatedState.currentConfig as any)?.model).toBe(newModel);
    expect(updatedState.currentConfig?.name).toBe(newName); // Previous update should persist
    expect(updatedState.isDirty).toBe(true); // Should remain true
  });

  it('updateField should not modify state if currentConfig is null', () => {
    const { updateField } = useAgentConfigStore.getState();
    const initialState = useAgentConfigStore.getState();

    updateField('name', 'This should not apply');

    const state = useAgentConfigStore.getState();
    expect(state.currentConfig).toBeNull();
    expect(state.isDirty).toBe(false); // Should not become dirty
    expect(state).toEqual(initialState); // Entire state should be unchanged
  });

  it('setIsDirty should manually set the isDirty status', () => {
    const { setIsDirty } = useAgentConfigStore.getState();

    setIsDirty(true);
    expect(useAgentConfigStore.getState().isDirty).toBe(true);

    setIsDirty(false);
    expect(useAgentConfigStore.getState().isDirty).toBe(false);
  });

  it('reset should clear currentConfig and isDirty', () => {
    const { setConfig, updateField, reset } = useAgentConfigStore.getState();

    // Setup a dirty state
    setConfig(sampleConfig);
    updateField('name', 'A new name to make it dirty');
    expect(useAgentConfigStore.getState().currentConfig).not.toBeNull();
    expect(useAgentConfigStore.getState().isDirty).toBe(true);

    reset();

    const state = useAgentConfigStore.getState();
    expect(state.currentConfig).toBeNull();
    expect(state.isDirty).toBe(false);
  });
});
