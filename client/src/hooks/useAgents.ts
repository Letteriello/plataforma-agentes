import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAgentStore } from '@/store/agentStore';
import agentService from '@/api/agentService';
import { AnyAgentConfig } from '@/types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

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
  const { agents, loadAgents } = useAgentStore();
  const queryClient = useQueryClient();

  const { isLoading, error } = useQuery({
    queryKey: ['agents'],
    queryFn: async () => {
      const data = await agentService.fetchAgents();
      loadAgents(data);
      return data;
    },
  });

  const { mutateAsync: deleteAgent, isLoading: isDeleting } = useMutation({
    mutationFn: (id: string) => agentService.deleteAgent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
    },
  });

  return {
    agents,
    isLoading,
    error: error || null,
    deleteAgent: deleteAgentMutation,
    isDeleting
    isLoading: isLoading || isDeleting,
    error: error as Error | null,
    deleteAgent,
  };
};

export default useAgents;
