import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import agentService from '@/api/agentService';
import { AnyAgentConfig } from '@/types';

export interface UseAgentsReturn {
  agents: AnyAgentConfig[] | undefined;
  isLoading: boolean;
  error: Error | null;
  deleteAgent: (agentId: string) => Promise<void>;
  isDeleting: boolean;
}

export const useAgents = (): UseAgentsReturn => {
  const queryClient = useQueryClient();

  const { data: agents, isLoading, error } = useQuery<AnyAgentConfig[], Error>({
    queryKey: ['agents'],
    queryFn: agentService.fetchAgents,
  });

  const { mutateAsync: deleteAgentMutation, isLoading: isDeleting } = useMutation<void, Error, string>({
    mutationFn: (agentId: string) => agentService.deleteAgent(agentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      // TODO: Consider adding toast notification for success
    },
    onError: (err) => {
      // TODO: Consider adding toast notification for error
      console.error("Error deleting agent:", err);
    }
  });

  return {
    agents,
    isLoading,
    error: error || null,
    deleteAgent: deleteAgentMutation,
    isDeleting
  };
};

export default useAgents;
