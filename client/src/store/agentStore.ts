import { create } from 'zustand';
import { AnyAgentConfig, AgentType } from '@/types/agent'; // Ajuste o caminho
import { mockInitialAgents } from '@/data/mock-initial-agents'; // Ajuste o caminho

interface AgentState {
  agents: AnyAgentConfig[];
  activeAgent: AnyAgentConfig | null;
  isLoading: boolean;
  error: string | null;
}

interface AgentActions {
  loadAgents: (agents: AnyAgentConfig[]) => void;
  addAgent: (agent: AnyAgentConfig) => void;
  removeAgent: (agentId: string) => void;
  updateAgent: (agent: AnyAgentConfig) => void;
  setActiveAgent: (agent: AnyAgentConfig | string | null) => void; // Permite passar ID para buscar no store
  _clearActiveIfMatches: (agentId: string) => void; // Ação interna auxiliar
}

export const useAgentStore = create<AgentState & AgentActions>((set, get) => ({
  // Estado Inicial
  agents: [], // Começa vazio, será carregado
  activeAgent: null,
  isLoading: false,
  error: null,

  // Ações
  loadAgents: (agentsToLoad) => set({ agents: agentsToLoad }),

  addAgent: (agent) => {
    // Se o agente não tiver ID, gere um (isso pode ser responsabilidade do agentService depois)
    const newAgent = agent.id ? agent : { ...agent, id: crypto.randomUUID() };
    set((state) => ({ agents: [...state.agents, newAgent] }));
  },

  removeAgent: (agentId) => {
    get()._clearActiveIfMatches(agentId); // Limpa activeAgent se for o mesmo
    set((state) => ({
      agents: state.agents.filter((agent) => agent.id !== agentId),
    }));
  },

  updateAgent: (updatedAgent) =>
    set((state) => ({
      agents: state.agents.map((agent) =>
        agent.id === updatedAgent.id ? updatedAgent : agent
      ),
      // Se o agente atualizado for o ativo, atualize o activeAgent também para ter a referência mais recente
      activeAgent: state.activeAgent?.id === updatedAgent.id ? updatedAgent : state.activeAgent,
    })),

  setActiveAgent: (agentOrId) => {
    if (agentOrId === null) {
      set({ activeAgent: null });
    } else if (typeof agentOrId === 'string') {
      const agentToActivate = get().agents.find(a => a.id === agentOrId);
      set({ activeAgent: agentToActivate || null });
    } else {
      set({ activeAgent: agentOrId });
    }
  },

  // Ação interna para limpar activeAgent se o ID corresponder
  // Usada por removeAgent e potencialmente por updateAgent se um agente for renomeado/desativado
  _clearActiveIfMatches: (agentId: string) => {
    if (get().activeAgent?.id === agentId) {
      set({ activeAgent: null });
    }
  },
}));

// Carregar os agentes mock iniciais ao inicializar o store (fora do create)
// Isso simula um carregamento inicial de dados
useAgentStore.getState().loadAgents(mockInitialAgents);

// Opcional: persistência com zustand/middleware (não incluído nesta tarefa)
// import { persist } from 'zustand/middleware';
// export const useAgentStore = create(
//   persist<AgentState & AgentActions>(
//     (set, get) => ({ ... }),
//     { name: 'agent-storage' } // nome da chave no localStorage
//   )
// );
