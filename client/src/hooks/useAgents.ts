import { useState, useEffect } from 'react';
import { useAgentStore } from '@/store/agentStore';
import agentService from '@/services/agentService';
import { AnyAgentConfig } from '@/types';

export interface UseAgentsReturn {
  agents: AnyAgentConfig[];
  isLoading: boolean;
  error: Error | null;
  deleteAgent: (agentId: string) => Promise<void>;
}

export const useAgents = (): UseAgentsReturn => {
  const { agents, loadAgents } = useAgentStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      try {
        const data = await agentService.fetchAgents();
        loadAgents(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, [loadAgents]);

  const deleteAgent = async (id: string) => {
    setIsLoading(true);
    try {
      await agentService.deleteAgent(id);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return { agents, isLoading, error, deleteAgent };
};

export default useAgents;
