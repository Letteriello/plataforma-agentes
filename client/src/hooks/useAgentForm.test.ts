import { renderHook, act } from '@testing-library/react';
import { useAgentForm } from './useAgentForm';
// Assuming AgentType here is the union of string literals like 'llm', 'a2a', etc.
// and createDefaultAgent is from '@/types/agents'
import { createDefaultAgent, LLMAgent, A2AAgent, SequentialAgent } from '@/types/agents';
import { vi } from 'vitest';

const mockNavigate = vi.fn();
const mockInvalidateQueries = vi.fn();
const mockToast = vi.fn();
const mockMutateAsync = vi.fn();

// Mock dependencies
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate, // Use the mockNavigate defined above
}));

vi.mock('react-query', () => ({
  useQueryClient: () => ({
    invalidateQueries: mockInvalidateQueries, // Use the mockInvalidateQueries defined above
  }),
  useMutation: () => ({ // Return the object with mutateAsync from the factory
    mutateAsync: mockMutateAsync,
  }),
}));

vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

// Define AgentType as a string literal union for test purposes based on its usage
type AgentType = 'llm' | 'sequential' | 'parallel' | 'a2a';

beforeEach(() => {
  vi.clearAllMocks();
  // mockNavigate, mockInvalidateQueries, mockMutateAsync, mockToast are cleared by vi.clearAllMocks()
  // and then reused by the vi.mock factories above.
  // No need for require-based assignments here anymore.
  // (require('react-query') as any).useQueryClient = () => ({
  //   invalidateQueries: mockInvalidateQueries,
  // });
  // (require('react-query') as any).useMutation = (fn: any, options?: any) => ({
  //   mutateAsync: mockMutateAsync,
  //   // Add other mutation properties if the hook uses them (e.g., isLoading)
  // });
  // (require('@/components/ui/use-toast') as any).useToast = () => ({
  //   toast: mockToast,
  // });
});

describe('useAgentForm', () => {
  it('should initialize with default llm agent when no initial agent is provided', () => {
    const { result } = renderHook(() => useAgentForm());
    expect(result.current.initialAgent.type).toBe('llm');
    expect(result.current.initialAgent.name).toBe('New Llm Agent'); // Default name from createDefaultAgent
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.errors).toEqual([]);
  });

  it('should initialize with provided initial agent', () => {
    const initialAgent = createDefaultAgent('a2a'); // Use a valid type
    initialAgent.name = 'Test A2A Agent';
    const { result } = renderHook(() => useAgentForm(initialAgent));
    expect(result.current.initialAgent.name).toBe('Test A2A Agent');
    expect(result.current.initialAgent.type).toBe('a2a');
  });

  it('should update agent type and reset relevant fields on handleTypeChange', () => {
    const initialAgent = createDefaultAgent('llm');
    initialAgent.name = 'Old Name';
    initialAgent.description = 'Old Description';
    (initialAgent as LLMAgent).model = 'old-model';

    const { result } = renderHook(() => useAgentForm(initialAgent));
    let updatedAgent: any;
    act(() => {
      // Pass the current agent state from the hook, which is result.current.initialAgent
      // if we assume the hook manages the state internally based on initialAgent reference.
      // More accurately, handleTypeChange is a utility function, the calling component would manage state.
      updatedAgent = result.current.handleTypeChange('a2a' as AgentType, initialAgent);
    });

    expect(updatedAgent.type).toBe('a2a');
    expect(updatedAgent.name).toBe('Old Name'); // Name should be preserved
    expect(updatedAgent.description).toBe('Old Description'); // Description should be preserved
    // Check a field specific to 'a2a' that would be set by createDefaultAgent('a2a')
    expect((updatedAgent as A2AAgent).endpoint).toBe('https://api.example.com/endpoint');
    // Check that LLM specific field is not there or is default
    expect((updatedAgent as LLMAgent).model).toBeUndefined();
  });

  it('should not reset fields if type has not changed on handleTypeChange', () => {
    const initialAgent = createDefaultAgent('llm');
    initialAgent.name = 'Test Name';
    (initialAgent as LLMAgent).model = 'gpt-4';

    const { result } = renderHook(() => useAgentForm(initialAgent));
    let returnedAgent;
    act(() => {
      // Pass the initialAgent itself as currentAgent
      returnedAgent = result.current.handleTypeChange('llm' as AgentType, initialAgent);
    });
    expect(returnedAgent).toEqual(initialAgent); // Should return the same agent
    expect((returnedAgent as LLMAgent).model).toBe('gpt-4');
  });

  it('should reset errors when resetErrors is called', () => {
    const { result } = renderHook(() => useAgentForm());
    // Simulate setting some errors by attempting an invalid submission
    const invalidAgent = createDefaultAgent('llm');
    invalidAgent.name = ''; // Makes it invalid
    act(() => {
       result.current.handleSubmit(invalidAgent); // This will set errors
    });
    // Ensure errors were actually set
    expect(result.current.errors.length).toBeGreaterThan(0);

    act(() => {
      result.current.resetErrors();
    });
    expect(result.current.errors).toEqual([]);
  });

  describe('handleSubmit', () => {
    it('should show validation error if agent name is missing', async () => {
      const { result } = renderHook(() => useAgentForm());
      const invalidAgent = createDefaultAgent('llm');
      invalidAgent.name = ''; // Invalid name

      await act(async () => {
        await result.current.handleSubmit(invalidAgent);
      });

      expect(result.current.errors).toContain('Agent name is required');
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Validation Error',
        variant: 'destructive',
      }));
      expect(mockMutateAsync).not.toHaveBeenCalled();
    });

    it('should show validation error for LLM agent if instruction is missing', async () => {
      const { result } = renderHook(() => useAgentForm());
      const invalidAgent = createDefaultAgent('llm') as LLMAgent;
      invalidAgent.name = 'Test LLM';
      invalidAgent.instruction = ''; // Invalid instruction

      await act(async () => {
        await result.current.handleSubmit(invalidAgent);
      });
      expect(result.current.errors).toContain('Instructions are required for LLM agents');
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({ title: 'Validation Error' }));
      expect(mockMutateAsync).not.toHaveBeenCalled();
    });

    it('should show validation error for Sequential agent if agents list is empty', async () => {
      const { result } = renderHook(() => useAgentForm());
      const invalidAgent = createDefaultAgent('sequential') as SequentialAgent;
      invalidAgent.name = 'Test Sequential';
      invalidAgent.agents = []; // Invalid agents list

      await act(async () => {
        await result.current.handleSubmit(invalidAgent);
      });
      expect(result.current.errors).toContain('Workflow must contain at least one agent');
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({ title: 'Validation Error' }));
      expect(mockMutateAsync).not.toHaveBeenCalled();
    });

    it('should show validation error for A2A agent if endpoint is invalid', async () => {
      const { result } = renderHook(() => useAgentForm());
      const invalidAgent = createDefaultAgent('a2a') as A2AAgent;
      invalidAgent.name = 'Test A2A';
      invalidAgent.endpoint = 'invalid-url'; // Invalid endpoint

      await act(async () => {
        await result.current.handleSubmit(invalidAgent);
      });
      expect(result.current.errors).toContain('A valid endpoint URL is required for A2A agents');
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({ title: 'Validation Error' }));
      expect(mockMutateAsync).not.toHaveBeenCalled();
    });


    it('should call create mutation if agent has no id (new agent)', async () => {
      const agentToCreate = createDefaultAgent('llm') as LLMAgent;
      agentToCreate.name = 'Test LLM Agent';
      agentToCreate.instruction = 'Be helpful'; // Valid instruction
      // Ensure mockMutateAsync is correctly configured for this call
      // The vi.mock factory for react-query should now handle providing mockMutateAsync.
      // We just need to ensure mockMutateAsync itself is set up for this specific test case.
      mockMutateAsync.mockResolvedValueOnce({ ...agentToCreate, id: 'new-agent-id' });

      const { result } = renderHook(() => useAgentForm());

      await act(async () => {
        await result.current.handleSubmit(agentToCreate);
      });

      expect(mockMutateAsync).toHaveBeenCalledWith(agentToCreate);
      expect(mockInvalidateQueries).toHaveBeenCalledWith('agents');
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Success',
        description: `Agent "${agentToCreate.name}" has been created successfully.`,
      }));
      expect(mockNavigate).toHaveBeenCalledWith('/agents/edit/new-agent-id', { replace: true });
      expect(result.current.errors).toEqual([]);
    });

    it('should call update mutation if agent has an id (existing agent)', async () => {
      const existingAgent = { ...createDefaultAgent('llm'), id: 'existing-agent-id', name: 'Old Name' } as LLMAgent;
      existingAgent.name = 'Updated Test LLM Agent';
      existingAgent.instruction = 'Be very helpful'; // Valid instruction

      // Ensure mockMutateAsync is correctly configured for this call
      mockMutateAsync.mockResolvedValueOnce(existingAgent);

      const { result } = renderHook(() => useAgentForm(existingAgent));

      await act(async () => {
        await result.current.handleSubmit(existingAgent);
      });

      expect(mockMutateAsync).toHaveBeenCalledWith(existingAgent);
      expect(mockInvalidateQueries).toHaveBeenCalledWith('agents');
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Success',
        description: `Agent "${existingAgent.name}" has been updated successfully.`,
      }));
      expect(mockNavigate).not.toHaveBeenCalled();
      expect(result.current.errors).toEqual([]);
    });

    it('should handle API error on submit', async () => {
      const agentToSubmit = createDefaultAgent('llm') as LLMAgent;
      agentToSubmit.name = 'Test Error Agent';
      agentToSubmit.instruction = 'Cause an error';
      const errorMessage = 'Network Error';

      // Ensure mockMutateAsync is correctly configured for this call
      mockMutateAsync.mockRejectedValueOnce(new Error(errorMessage));

      const { result } = renderHook(() => useAgentForm());

      await act(async () => {
        await result.current.handleSubmit(agentToSubmit);
      });

      expect(mockMutateAsync).toHaveBeenCalledWith(agentToSubmit);
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      }));
      expect(mockInvalidateQueries).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});
