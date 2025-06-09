import { renderHook, waitFor, act } from '@testing-library/react';
import { vi } from 'vitest';
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

describe('useAgents hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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

    const { result } = renderHook(() => useAgents());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockLoadAgents).toHaveBeenCalledWith(expectedAgents);
    // The hook itself returns the agents from the store, so we check what the store is set to provide
    mockAgentsSelector.mockReturnValueOnce(expectedAgents); // Simulate store updated after loadAgents
     const { result: resultAfterLoad } = renderHook(() => useAgents()); // Re-render or get updated state
    // This re-render is a bit artificial for a hook test.
    // A better way is to test component that USES useAgents.
    // For the hook, we've tested that loadAgents is called with the correct data.
    // The hook's returned `agents` value comes from the store directly.
    // So, we set what the store mock will return for `agents`.
    (useAgentStore as unknown as vi.Mock).mockReturnValue({
        agents: expectedAgents,
        loadAgents: mockLoadAgents,
    });
    const { result: finalResult } = renderHook(() => useAgents());
    expect(finalResult.current.agents).toEqual(expectedAgents);

  });

  test('should handle fetch error', async () => {
    // Override the default MSW handler for this specific test
    server.use(
      http.get('/api/agents', () => {
        return new HttpResponse(null, { status: 500, statusText: 'Server Error' });
      })
    );

    const { result } = renderHook(() => useAgents());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).not.toBeNull();
    expect(result.current.error?.message).toBe('Request failed with status code 500 (Server Error)'); // MSW error format
    expect(mockLoadAgents).not.toHaveBeenCalled();
  });

  test('deleteAgent should call the service and manage loading states', async () => {
    const agentIdToDelete = mockAgentsDB[0].id; // Assuming mockAgentsDB has at least one agent
     (useAgentStore as unknown as vi.Mock).mockReturnValue({
        agents: mockAgentsDB, // Simulate store having agents
        loadAgents: mockLoadAgents,
    });

    const { result } = renderHook(() => useAgents());

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
    const agentIdToDelete = 'agent-1';
     (useAgentStore as unknown as vi.Mock).mockReturnValue({
        agents: mockAgentsDB,
        loadAgents: mockLoadAgents,
    });

    // Override MSW handler for delete to return an error
    server.use(
      http.delete(`/api/agents/${agentIdToDelete}`, () => {
        return new HttpResponse(null, { status: 500, statusText: 'Deletion Failed' });
      })
    );

    const { result } = renderHook(() => useAgents());
    await waitFor(() => expect(result.current.isLoading).toBe(false)); // Wait for initial load to complete

    let deletePromise: Promise<void>;
    act(() => {
        deletePromise = result.current.deleteAgent(agentIdToDelete);
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
