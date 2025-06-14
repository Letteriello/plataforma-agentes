import { renderHook, waitFor, act } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAgents } from './useAgents';
import { useAgentStore } from '@/store/agentStore';
import { AnyAgentConfig, AgentType } from '@/types/core/agent'; // Corrected path
import { server } from '@/mocks/server'; // Import MSW server for specific handlers
import { http, HttpResponse } from 'msw'; // Import msw utilities for dynamic handlers
import { mockAgentsDB, resetMockAgentsDB } from '@/mocks/handlers'; // To access the mock DB

// Mock the Zustand store
vi.mock('@/store/agentStore');

const mockLoadAgents = vi.fn();
const mockAgentsSelector = vi.fn(); // For selecting agents from store

let currentTestAgents: AnyAgentConfig[]; // Define at a higher scope

// Helper to wrap hook with QueryClientProvider
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // Turn off retries for testing
    },
  },
});

const renderWithClient = (client: QueryClient, hook: () => any) => {
  return renderHook(hook, {
    wrapper: ({ children }) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    ),
  });
};

describe('useAgents hook', () => {
  let testQueryClient: QueryClient;

  beforeEach(() => {
    testQueryClient = createTestQueryClient();
    vi.clearAllMocks();
    // Initialize currentTestAgents here for each test if they need to be fresh
    currentTestAgents = [
      { id: 'test-agent-del-1', name: 'Test Delete Me', type: AgentType.LLM, model: 'm', instruction: 'i', version: '1' },
      { id: 'test-agent-del-2', name: 'Test Keep Me', type: AgentType.LLM, model: 'm', instruction: 'i', version: '1' },
    ];
    // Setup the mock for useAgentStore for each test
    // The hook reads 'agents' from the store and calls 'loadAgents'
    (useAgentStore as unknown as vi.Mock).mockReturnValue({
      agents: mockAgentsSelector(), // The hook will return this value
      loadAgents: mockLoadAgents,
    });
    mockAgentsSelector.mockReturnValue([]); // Default to empty initially
    resetMockAgentsDB(); // Ensure clean DB for each test
  });

  test('should fetch agents on init, call loadAgents, and manage loading states', async () => {
    // mockAgentsDB is pre-populated by resetMockAgentsDB()
    const expectedAgents = mockAgentsDB;
    mockAgentsSelector.mockReturnValueOnce([]); // Initial call before fetch

    const { result } = renderWithClient(testQueryClient, () => useAgents());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockLoadAgents).toHaveBeenCalledWith(expectedAgents);
    // The hook itself returns the agents from the store, so we check what the store is set to provide
    mockAgentsSelector.mockReturnValueOnce(expectedAgents); // Simulate store updated after loadAgents
    // Re-rendering the hook to get updated state after store change
    const { result: resultAfterLoad } = renderWithClient(testQueryClient, () => useAgents());
    // This re-render is a bit artificial for a hook test.
    // A better way is to test a component that USES useAgents.
    // For the hook, we've tested that loadAgents is called with the correct data.
    // The hook's returned `agents` value comes from the store directly.
    // So, we set what the store mock will return for `agents`.
    (useAgentStore as unknown as vi.Mock).mockReturnValue({
        agents: expectedAgents,
        loadAgents: mockLoadAgents,
    });
    const { result: finalResult } = renderWithClient(testQueryClient, () => useAgents());
    expect(finalResult.current.agents).toEqual(expectedAgents);

  });

  test('should handle fetch error', async () => {
    // Override the default MSW handler for this specific test
    server.use(
      http.get('/api/agents', () => {
        return new HttpResponse(null, { status: 500, statusText: 'Server Error' });
      })
    );

    const { result } = renderWithClient(testQueryClient, () => useAgents());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).not.toBeNull();
    expect(result.current.error?.message).toBe('Request failed with status code 500 (Server Error)'); // MSW error format
    expect(mockLoadAgents).not.toHaveBeenCalled();
  });

  test('deleteAgent should call the service and manage loading states', async () => {
    const agentIdToDelete = currentTestAgents[0].id; // Now uses the one from beforeEach

     (useAgentStore as unknown as vi.Mock).mockReturnValue({
        agents: currentTestAgents, // Use this local copy for the store
        loadAgents: mockLoadAgents,
    });

    // Ensure MSW handler uses a clean DB state for this test if necessary,
    // though delete operation itself should work on the mockAgentsDB manipulated by MSW.
    // For this test, we mainly care that the hook calls the service.
    // The actual deletion from mockAgentsDB is tested by MSW's own logic implicitly.

    const { result } = renderWithClient(testQueryClient, () => useAgents());

    // Check initial state - no error, not loading (after initial fetch)
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.error).toBeNull();

    let deletePromise: Promise<void>;
    act(() => {
      deletePromise = result.current.deleteAgent(agentIdToDelete);
    });

    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      await deletePromise;
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull(); // Assuming successful deletion by MSW default handler

    // Verify the agent is "deleted" from our mock DB (MSW handler for DELETE modifies mockAgentsDB)
    // This means a subsequent fetch would not include it.
    // The hook itself doesn't refetch or update the store post-delete in the current implementation.
    // So, we can't check result.current.agents directly for the change without a refetch/store update.
  });

  test('deleteAgent should handle API error', async () => {
    const agentIdToDeleteFromGlobalDB = 'agent-1'; // This ID is expected by the MSW handler if it's not reset for this test
     (useAgentStore as unknown as vi.Mock).mockReturnValue({
        // This setup is for the hook's initial state if it reads from store before acting.
        // For delete, the hook primarily calls a service, then refetches (invalidates query).
        agents: currentTestAgents, // Using the same local copy
        loadAgents: mockLoadAgents,
    });

    // Override MSW handler for delete to return an error
    server.use(
      http.delete(`/api/agents/${agentIdToDeleteFromGlobalDB}`, () => { // Ensure this ID matches what the hook will use
        return new HttpResponse(null, { status: 500, statusText: 'Deletion Failed' });
      })
    );

    const { result } = renderWithClient(testQueryClient, () => useAgents());
    await waitFor(() => expect(result.current.isLoading).toBe(false)); // Wait for initial load to complete

    let deletePromise: Promise<void>;
    act(() => {
      // The hook will internally use its 'agents' state if it needs to find an agent by ID before deleting.
      // However, the deleteAgent function in useAgents hook seems to just take an ID.
        deletePromise = result.current.deleteAgent(agentIdToDeleteFromGlobalDB);
    });

    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      await deletePromise;
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).not.toBeNull();
    expect(result.current.error?.message).toBe('Request failed with status code 500 (Deletion Failed)');
  });
});
