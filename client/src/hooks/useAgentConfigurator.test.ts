import { renderHook, act } from '@testing-library/react';
import { useAgentConfigurator } from './useAgentConfigurator';
import { useAgentStore } from '@/components/features/agents-list/store/agentStore';
import agentService from '@/api/agentService';
import { AnyAgentConfig, AgentType } from '@/types/core/agent'; // Assuming core types
import { vi } from 'vitest';

// Mock dependencies
vi.mock('@/components/features/agents-list/store/agentStore');
vi.mock('@/api/agentService');

const mockUpdateAgent = vi.fn();
const mockSaveAgent = vi.fn();

const initialTestConfig: AnyAgentConfig = {
  id: 'agent-123',
  name: 'Test Agent',
  type: AgentType.LLM, // Assuming AgentType enum is available and LLM is a valid type
  version: '1.0.0',
  // Add other required fields for a base LLM agent if necessary
  model: 'test-model',
  instruction: 'test-instruction',
};

const modifiedTestConfig: AnyAgentConfig = {
  ...initialTestConfig,
  name: 'Modified Test Agent',
  description: 'This is a modified agent.',
};

describe('useAgentConfigurator', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Setup mock implementations
    (useAgentStore as unknown as vi.Mock).mockReturnValue({
      updateAgent: mockUpdateAgent,
    });
    (agentService.saveAgent as vi.Mock).mockImplementation(mockSaveAgent);
  });

  it('should initialize with the provided initial config', () => {
    const { result } = renderHook(() => useAgentConfigurator(initialTestConfig));

    expect(result.current.config).toEqual(initialTestConfig);
    expect(result.current.isSaving).toBe(false);
    expect(result.current.isDirty).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should update config and set isDirty to true on updateConfig', () => {
    const { result } = renderHook(() => useAgentConfigurator(initialTestConfig));
    const updates: Partial<AnyAgentConfig> = { name: 'New Name', description: 'New Description' };

    act(() => {
      result.current.updateConfig(updates);
    });

    expect(result.current.config.name).toBe('New Name');
    expect(result.current.config.description).toBe('New Description');
    expect(result.current.isDirty).toBe(true);
  });

  it('should reset config to initial and set isDirty to false on resetConfig', () => {
    const { result } = renderHook(() => useAgentConfigurator(initialTestConfig));
    act(() => {
      result.current.updateConfig({ name: 'Temporary Name' });
    });
    expect(result.current.isDirty).toBe(true);

    act(() => {
      result.current.resetConfig();
    });

    expect(result.current.config).toEqual(initialTestConfig);
    expect(result.current.isDirty).toBe(false);
  });

  describe('saveConfig', () => {
    it('should call agentService.saveAgent, update store, and reset isDirty on successful save', async () => {
      const savedAgent = { ...initialTestConfig, version: '1.0.1' };
      mockSaveAgent.mockResolvedValue(savedAgent);

      const { result } = renderHook(() => useAgentConfigurator(initialTestConfig));

      // Make it dirty
      act(() => {
        result.current.updateConfig({name: "Dirty Agent"});
      });
      expect(result.current.isDirty).toBe(true);
      const configToSave = result.current.config;


      await act(async () => {
        await result.current.saveConfig();
      });

      expect(result.current.isSaving).toBe(false);
      expect(mockSaveAgent).toHaveBeenCalledWith(configToSave);
      expect(mockUpdateAgent).toHaveBeenCalledWith(savedAgent);
      expect(result.current.isDirty).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should set error state and keep isDirty true on failed save', async () => {
      const saveError = new Error('Failed to save');
      mockSaveAgent.mockRejectedValue(saveError);

      const { result } = renderHook(() => useAgentConfigurator(initialTestConfig));

      act(() => {
        result.current.updateConfig({name: "Another Dirty Agent"});
      });
      expect(result.current.isDirty).toBe(true);
      const configToSave = result.current.config;


      await act(async () => {
        await result.current.saveConfig();
      });

      expect(result.current.isSaving).toBe(false);
      expect(mockSaveAgent).toHaveBeenCalledWith(configToSave);
      expect(mockUpdateAgent).not.toHaveBeenCalled();
      expect(result.current.isDirty).toBe(true);
      expect(result.current.error).toEqual(saveError);
    });

    it('should set isSaving to true while saving', async () => {
      mockSaveAgent.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve(initialTestConfig), 50)));
      const { result } = renderHook(() => useAgentConfigurator(initialTestConfig));

      let promise;
      act(() => {
        promise = result.current.saveConfig();
      });

      expect(result.current.isSaving).toBe(true);
      await act(async () => {
        await promise;
      });
      expect(result.current.isSaving).toBe(false);
    });
  });
});
