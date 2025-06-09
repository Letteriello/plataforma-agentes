import { useState, useEffect } from 'react';
import { useAgentStore } from '@/store/agentStore';
import { AnyAgentConfig } from '@/types';

export interface UseAgentsReturn {
  agents: AnyAgentConfig[];
  isLoading: boolean;
  error: Error | null;
  deleteAgent: (agentId: string) => Promise<void>;
}

export const useAgents = (): UseAgentsReturn => {
  const { agents, fetchAgents, deleteAgent: deleteFromStore } = useAgentStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      try {
        await fetchAgents();
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, [fetchAgents]);

  const deleteAgent = async (id: string) => {
    setIsLoading(true);
    try {
      await deleteFromStore(id);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return { agents, isLoading, error, deleteAgent };
};

export default useAgents;
