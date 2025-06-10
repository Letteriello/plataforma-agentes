import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAgentStore } from '@/components/features/agents-list/store/agentStore'; // Corrected path
import agentService from '@/api/agentService';
import { AnyAgentConfig } from '@/types'; // Assuming this path is okay

export interface UseAgentsReturn {
  agents: AnyAgentConfig[] | undefined; // Will come from useAgentStore
  isLoading: boolean;
  error: Error | null;
  deleteAgent: (agentId: string) => Promise<void>;
}

export const useAgents = (): UseAgentsReturn => {
  const { agents, loadAgents } = useAgentStore(); // Get agents and loadAgents from store
  const queryClient = useQueryClient();

  // Initial fetching and loading into store
  const { isLoading: initialLoading, error: initialError } = useQuery<AnyAgentConfig[], Error>({
    queryKey: ['agents'], // Unique query key
    queryFn: async () => {
      const data = await agentService.fetchAgents();
      loadAgents(data); // Load fetched data into the Zustand store
      return data;
    },
    // staleTime: 5 * 60 * 1000, // Optional: 5 minutes
  });

  // Mutation for deleting an agent
  const { mutateAsync: deleteAgentMutation, isLoading: isDeleting } = useMutation<void, Error, string>({
    mutationFn: (agentId: string) => agentService.deleteAgent(agentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      // The store will be updated via the fetchAgents re-query or a specific remove action
      // For now, invalidation handles refetching and store update.
    },
    onError: (err) => {
      console.error("Error deleting agent:", err);
      // Potentially update store or show toast
    }
  });

  return {
    agents, // Directly return agents from the store
    isLoading: initialLoading || isDeleting, // Combine loading states
    error: initialError || null, // Return error from initial fetch if any
    deleteAgent: deleteAgentMutation,
  };
};

export default useAgents;
