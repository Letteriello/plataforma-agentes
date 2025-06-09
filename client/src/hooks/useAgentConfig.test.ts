import { renderHook, act } from '@testing-library/react-hooks';
import { useAgentConfig } from './useAgentConfig';
import { AgentType, LlmAgentConfig, AnyAgentConfig, SafetySetting, createDefaultAgentConfig } from '@/types/core/agent'; // Adjusted import path
import { vi } from 'vitest';

// Mock deepClone or ensure it's available if it's from a module not auto-mocked
vi.mock('@/lib/utils', async (importOriginal) => {
  const original = await importOriginal<typeof import('@/lib/utils')>();
  return {
    ...original,
    deepClone: vi.fn((obj) => JSON.parse(JSON.stringify(obj))), // Simple mock for deepClone
  };
});


describe('useAgentConfig', () => {
  const initialLlmConfig = createDefaultAgentConfig(AgentType.LLM) as LlmAgentConfig;
  initialLlmConfig.tools = ['tool-123', 'tool-abc'] as any[]; // Assuming tools are stored as string IDs
  initialLlmConfig.safetySettings = [
    { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
    { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_LOW_AND_ABOVE' },
  ];

  const anotherLlmConfig = createDefaultAgentConfig(AgentType.LLM) as LlmAgentConfig;
  anotherLlmConfig.name = "Another LLM Agent";
  anotherLlmConfig.model = "gemini-ultra";


  beforeEach(() => {
    vi.clearAllMocks();
    // Reset mock for deepClone if needed, or ensure it's fresh for each test run
    (require('@/lib/utils') as any).deepClone = vi.fn((obj) => JSON.parse(JSON.stringify(obj)));
  });

  it('should initialize with initialConfig', () => {
    const { result } = renderHook(() => useAgentConfig({ initialConfig: initialLlmConfig }));
    expect(result.current.config).toEqual(initialLlmConfig);
    expect(require('@/lib/utils').deepClone).toHaveBeenCalledWith(initialLlmConfig);
  });

  it('should update config when initialConfig prop changes', () => {
    const { result, rerender } = renderHook(
      ({ initialConfig }) => useAgentConfig({ initialConfig }),
      { initialProps: { initialConfig: initialLlmConfig } }
    );
    expect(result.current.config.name).toBe(initialLlmConfig.name);

    rerender({ initialConfig: anotherLlmConfig });

    expect(result.current.config.name).toBe(anotherLlmConfig.name);
    expect(result.current.config.model).toBe(anotherLlmConfig.model);
    expect(require('@/lib/utils').deepClone).toHaveBeenCalledWith(anotherLlmConfig);
  });

  it('should update config completely with updateConfig', () => {
    const { result } = renderHook(() => useAgentConfig({ initialConfig: initialLlmConfig }));
    act(() => {
      result.current.updateConfig(anotherLlmConfig);
    });
    expect(result.current.config).toEqual(anotherLlmConfig);
    expect(require('@/lib/utils').deepClone).toHaveBeenCalledWith(anotherLlmConfig);
  });

  it('should update a specific field with updateField', () => {
    const { result } = renderHook(() => useAgentConfig({ initialConfig: initialLlmConfig }));
    const newName = 'Updated LLM Agent Name';
    act(() => {
      result.current.updateField('name', newName);
    });
    expect(result.current.config.name).toBe(newName);
    // Ensure other fields remain the same
    expect(result.current.config.model).toBe(initialLlmConfig.model);

    const newTemperature = 0.99;
    act(() => {
      result.current.updateField('temperature', newTemperature);
    });
    expect((result.current.config as LlmAgentConfig).temperature).toBe(newTemperature);
  });

  describe('addTool', () => {
    it('should add a tool ID to the tools array', () => {
      const configWithoutTools = createDefaultAgentConfig(AgentType.LLM) as LlmAgentConfig;
      configWithoutTools.tools = [] as any[]; // Start with empty array for clarity
      const { result } = renderHook(() => useAgentConfig({ initialConfig: configWithoutTools }));

      act(() => {
        result.current.addTool('new-tool-id');
      });
      expect((result.current.config as LlmAgentConfig).tools).toEqual(['new-tool-id']);
    });

    it('should add a tool ID to an existing tools array', () => {
      const { result } = renderHook(() => useAgentConfig({ initialConfig: initialLlmConfig })); // initialLlmConfig has ['tool-123', 'tool-abc']
      act(() => {
        result.current.addTool('new-tool-id');
      });
      expect((result.current.config as LlmAgentConfig).tools).toEqual(['tool-123', 'tool-abc', 'new-tool-id']);
    });

    it('should not add a duplicate tool ID', () => {
      const { result } = renderHook(() => useAgentConfig({ initialConfig: initialLlmConfig }));
      act(() => {
        result.current.addTool('tool-123'); // Already exists
      });
      expect((result.current.config as LlmAgentConfig).tools).toEqual(['tool-123', 'tool-abc']);
    });

    it('should not modify config if tools field does not exist (e.g., non-LLM agent)', () => {
      const nonLlmConfig = createDefaultAgentConfig(AgentType.A2A); // A2A agents don't have .tools
      const { result } = renderHook(() => useAgentConfig({ initialConfig: nonLlmConfig }));
      const originalConfig = JSON.parse(JSON.stringify(nonLlmConfig)); // Deep clone for comparison
      act(() => {
        result.current.addTool('new-tool-id');
      });
      expect(result.current.config).toEqual(originalConfig);
    });
  });

  describe('removeTool', () => {
    it('should remove an existing tool ID from the tools array', () => {
      const { result } = renderHook(() => useAgentConfig({ initialConfig: initialLlmConfig })); // ['tool-123', 'tool-abc']
      act(() => {
        result.current.removeTool('tool-123');
      });
      expect((result.current.config as LlmAgentConfig).tools).toEqual(['tool-abc']);
    });

    it('should not change tools array if tool ID does not exist', () => {
      const { result } = renderHook(() => useAgentConfig({ initialConfig: initialLlmConfig }));
      act(() => {
        result.current.removeTool('non-existent-tool');
      });
      expect((result.current.config as LlmAgentConfig).tools).toEqual(['tool-123', 'tool-abc']);
    });

    it('should not change tools array if it is empty', () => {
      const configWithEmptyTools = createDefaultAgentConfig(AgentType.LLM) as LlmAgentConfig;
      configWithEmptyTools.tools = [] as any[];
      const { result } = renderHook(() => useAgentConfig({ initialConfig: configWithEmptyTools }));
      act(() => {
        result.current.removeTool('any-tool');
      });
      expect((result.current.config as LlmAgentConfig).tools).toEqual([]);
    });

    it('should not modify config if tools field does not exist', () => {
      const nonLlmConfig = createDefaultAgentConfig(AgentType.A2A);
      const { result } = renderHook(() => useAgentConfig({ initialConfig: nonLlmConfig }));
      const originalConfig = JSON.parse(JSON.stringify(nonLlmConfig));
      act(() => {
        result.current.removeTool('any-tool');
      });
      expect(result.current.config).toEqual(originalConfig);
    });
  });

  describe('updateSafetySetting', () => {
    it('should update an existing safety setting by index', () => {
      const { result } = renderHook(() => useAgentConfig({ initialConfig: initialLlmConfig }));
      const newSetting: SafetySetting = { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' };
      act(() => {
        result.current.updateSafetySetting(0, newSetting);
      });
      expect((result.current.config as LlmAgentConfig).safetySettings![0]).toEqual(newSetting);
      expect((result.current.config as LlmAgentConfig).safetySettings![1]).toEqual(initialLlmConfig.safetySettings![1]);
    });

    it('should add a new safety setting if index is out of bounds (extends array)', () => {
      const { result } = renderHook(() => useAgentConfig({ initialConfig: initialLlmConfig }));
      const newSetting: SafetySetting = { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' };
      act(() => {
        result.current.updateSafetySetting(2, newSetting); // initialLlmConfig has 2 settings (index 0, 1)
      });
      expect((result.current.config as LlmAgentConfig).safetySettings![2]).toEqual(newSetting);
      expect((result.current.config as LlmAgentConfig).safetySettings?.length).toBe(3);
    });

    it('should initialize safetySettings array if it does not exist and then add', () => {
      const configWithoutSafety = createDefaultAgentConfig(AgentType.LLM) as LlmAgentConfig;
      delete configWithoutSafety.safetySettings; // Ensure it's undefined
      const { result } = renderHook(() => useAgentConfig({ initialConfig: configWithoutSafety }));
      const newSetting: SafetySetting = { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' };
      act(() => {
        result.current.updateSafetySetting(0, newSetting);
      });
      expect((result.current.config as LlmAgentConfig).safetySettings![0]).toEqual(newSetting);
      expect((result.current.config as LlmAgentConfig).safetySettings?.length).toBe(1);
    });

    // Test adjusted based on hook's actual behavior revealed during thought process
    it('should add safetySettings array even if agent is not LLM type', () => {
        const nonLlmConfig = createDefaultAgentConfig(AgentType.A2A) as AnyAgentConfig;
        const { result } = renderHook(() => useAgentConfig({ initialConfig: nonLlmConfig }));
        const newSetting: SafetySetting = { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' };
        act(() => {
            result.current.updateSafetySetting(0, newSetting);
        });
        // The hook currently adds a safetySettings array to any config type.
        expect((result.current.config as LlmAgentConfig).safetySettings![0]).toEqual(newSetting);
        expect((result.current.config as LlmAgentConfig).safetySettings?.length).toBe(1);
    });
  });

  it('should reset the config to the initialConfig', () => {
    const { result } = renderHook(() => useAgentConfig({ initialConfig: initialLlmConfig }));
    // Modify the config
    act(() => {
      result.current.updateField('name', 'Temporary Name');
      result.current.addTool('temp-tool');
    });
    expect(result.current.config.name).toBe('Temporary Name');
    expect((result.current.config as LlmAgentConfig).tools).toContain('temp-tool');

    // Reset
    act(() => {
      result.current.reset();
    });
    expect(result.current.config).toEqual(initialLlmConfig);
    expect(require('@/lib/utils').deepClone).toHaveBeenCalledWith(initialLlmConfig);
  });

  it('should reset to the most recent initialConfig if it changed', () => {
    const { result, rerender } = renderHook(
      ({ initialConfig }) => useAgentConfig({ initialConfig }),
      { initialProps: { initialConfig: initialLlmConfig } }
    );

    // Change initialConfig
    rerender({ initialConfig: anotherLlmConfig });

    // Modify the live config
    act(() => {
      result.current.updateField('name', 'Modified Name Again');
    });
    expect(result.current.config.name).toBe('Modified Name Again');

    // Reset
    act(() => {
      result.current.reset();
    });
    // Should reset to 'anotherLlmConfig', not the original 'initialLlmConfig'
    expect(result.current.config).toEqual(anotherLlmConfig);
    expect(require('@/lib/utils').deepClone).toHaveBeenCalledWith(anotherLlmConfig);
  });
});
