// src/store/agentStore.ts
import { create } from 'zustand';
import { AnyAgentConfig } from '@/types/agent';
import { mockInitialAgents } from '@/data/mocks/mock-initial-agents';

/**
 * @interface AgentState
 * @description Define a estrutura do estado para o gerenciamento de agentes.
 * @property {AnyAgentConfig[]} agents - Lista de todas as configurações de agentes.
 * @property {AnyAgentConfig | null} activeAgent - O agente atualmente selecionado para edição ou visualização.
 * @property {boolean} isLoading - Sinalizador para operações assíncronas.
 * @property {string | null} error - Mensagem de erro, caso ocorra.
 */
interface AgentState {
  agents: AnyAgentConfig[];
  activeAgent: AnyAgentConfig | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * @interface AgentActions
 * @description Define as ações que podem ser executadas para modificar o estado dos agentes.
 */
interface AgentActions {
  loadAgents: (agents: AnyAgentConfig[]) => void;
  addAgent: (agent: AnyAgentConfig) => void;
  removeAgent: (agentId: string) => void;
  updateAgent: (agent: AnyAgentConfig) => void;
  setActiveAgent: (agent: AnyAgentConfig | string | null) => void;
}

/**
 * @constant useAgentStore
 * @description Hook customizado do Zustand para gerenciar o estado global dos agentes.
 * Combina o estado e as ações em um único store.
 */
export const useAgentStore = create<AgentState & AgentActions>((set, get) => ({
  // Estado Inicial
  agents: [],
  activeAgent: null,
  isLoading: false,
  error: null,

  // Ações
  loadAgents: (agentsToLoad) => set({ agents: agentsToLoad }),

  addAgent: (agent) => {
    const newAgent = agent.id ? agent : { ...agent, id: crypto.randomUUID() };
    set((state) => ({ agents: [...state.agents, newAgent] }));
  },

  removeAgent: (agentId) => {
    if (get().activeAgent?.id === agentId) {
      set({ activeAgent: null });
    }
    set((state) => ({
      agents: state.agents.filter((agent) => agent.id !== agentId),
    }));
  },

  updateAgent: (updatedAgent) =>
    set((state) => ({
      agents: state.agents.map((agent) =>
        agent.id === updatedAgent.id ? updatedAgent : agent
      ),
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
}));

// Carrega os dados mockados iniciais para popular o store na inicialização.
useAgentStore.getState().loadAgents(mockInitialAgents);
