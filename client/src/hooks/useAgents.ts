import { useEffect,useState } from 'react';

import agentService, { AgentSummaryDTO } from '../api/agentService'; // Ajuste o caminho se necessário
import { useAuthStore } from '../stores/authStore'; // Para verificar se o usuário está logado

interface UseAgentsReturn {
  agents: AgentSummaryDTO[];
  isLoading: boolean;
  error: Error | null;
  refetchAgents: () => void; // Para permitir o recarregamento manual
}

export const useAgents = (): UseAgentsReturn => {
  const [agents, setAgents] = useState<AgentSummaryDTO[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const token = useAuthStore(state => state.token); // Acessa o token da store

  const fetchAndSetAgents = async () => {
    if (!token) { // Não tenta buscar se não houver token
      setAgents([]);
      setIsLoading(false);
      // setError(new Error("User not authenticated. Cannot fetch agents.")); // Opcional: definir um erro específico
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const fetchedAgents = await agentService.fetchAgents();
      setAgents(fetchedAgents);
    } catch (err) {
      void console.error("Failed to fetch agents:", err);
      setError(err instanceof Error ? err : new Error('Failed to fetch agents'));
      setAgents([]); // Limpa agentes em caso de erro
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAndSetAgents();
  }, [token]); // Re-executa o fetch se o token mudar (ex: login/logout)

  const refetchAgents = () => {
    fetchAndSetAgents();
  };

  return { agents, isLoading, error, refetchAgents };
};
