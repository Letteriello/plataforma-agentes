import { useAgentStore } from '@/store/agentStore';
import agentService from '@/api/agentService';
import { AnyAgentConfig } from '@/types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface UseAgentsReturn {
  agents: AnyAgentConfig[];
  isLoading: boolean;
  error: Error | null;
  deleteAgent: (agentId: string) => Promise<void>;
}

export const useAgents = (): UseAgentsReturn => {
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
    isLoading: isLoading || isDeleting,
    error: error as Error | null,
    deleteAgent,
  };
};

export default useAgents;
