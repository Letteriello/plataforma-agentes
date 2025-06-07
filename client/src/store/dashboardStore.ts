import { create, StateCreator } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

// Type-safe ID generator
const generateId = (): string => {
  return uuidv4();
};

export type AgentStatus = 'online' | 'offline' | 'busy' | 'error';

export interface Agent {
  id: string;
  name: string;
  status: AgentStatus;
  lastActive: string;
  type: 'llm' | 'workflow' | 'tool';
}

export type ActivityType = 'info' | 'success' | 'warning' | 'error';

export interface Activity {
  id: string;
  type: ActivityType;
  message: string;
  timestamp: string;
}

interface DashboardState {
  // Dados de agentes
  agents: Agent[];
  activeAgentsCount: number;
  
  // Dados de sessões
  activeSessions: number;
  totalSessions24h: number;
  
  // Atividades recentes
  recentActivities: Activity[];
}

interface DashboardActions {
  createAgent: (name: string, type: 'llm' | 'workflow' | 'tool') => void;
  updateAgentStatus: (id: string, status: AgentStatus) => void;
  addActivity: (type: Activity['type'], message: string) => void;
  fetchDashboardData: () => Promise<void>;
}

// Dados iniciais mockados
const MOCK_AGENTS: Agent[] = [
  {
    id: '1',
    name: 'Agente de Vendas',
    status: 'online' as const,
    lastActive: new Date().toISOString(),
    type: 'llm' as const,
  },
  {
    id: '2',
    name: 'Suporte ao Cliente',
    status: 'busy' as const,
    lastActive: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutos atrás
    type: 'workflow' as const,
  },
  {
    id: '3',
    name: 'Análise de Dados',
    status: 'offline' as const,
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 horas atrás
    type: 'tool' as const,
  },
];

const MOCK_ACTIVITIES: Activity[] = [
  {
    id: '1',
    type: 'success',
    message: 'Novo agente "Análise de Dados" criado com sucesso',
    timestamp: new Date().toISOString(),
  },
  {
    id: '2',
    type: 'info',
    message: 'Atualização de sistema agendada para hoje à noite',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutos atrás
  },
  {
    id: '3',
    type: 'warning',
    message: 'Alta utilização de CPU no servidor principal',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 horas atrás
  },
];

// Create the store with proper typing
const store: StateCreator<DashboardState & DashboardActions> = (set, get) => ({
  // Estado inicial
  agents: [...MOCK_AGENTS],
  activeAgentsCount: MOCK_AGENTS.filter(agent => agent.status === 'online').length,
  activeSessions: 12,
  totalSessions24h: 147,
  recentActivities: [...MOCK_ACTIVITIES],
  
  // Ações
  createAgent: (name: string, type: 'llm' | 'workflow' | 'tool') => {
    const newAgent: Agent = {
      id: generateId(),
      name,
      status: 'offline' as const,
      lastActive: new Date().toISOString(),
      type,
    };
    
    set((state: DashboardState) => ({
      agents: [...state.agents, newAgent],
      activeAgentsCount: state.activeAgentsCount + (newAgent.status === 'online' ? 1 : 0),
    }));
    
    // Adiciona uma atividade
    get().addActivity('info', `Novo agente criado: ${name}`);
  },
  
  updateAgentStatus: (id: string, status: AgentStatus) => {
    set((state: DashboardState) => {
      const updatedAgents = state.agents.map(agent => 
        agent.id === id ? { ...agent, status } : agent
      );
      
      return {
        agents: updatedAgents,
        activeAgentsCount: updatedAgents.filter(a => a.status === 'online').length,
      };
    });
  },
  
  addActivity: (type: ActivityType, message: string) => {
    const newActivity: Activity = {
      id: uuidv4(),
      type,
      message,
      timestamp: new Date().toISOString(),
    };
    
    set((state: DashboardState) => ({
      recentActivities: [newActivity, ...state.recentActivities].slice(0, 50), // Limita a 50 atividades
    }));
  },
  
  fetchDashboardData: () => {
    // Simulando uma chamada de API
    const promise = new Promise<void>((resolve) => {
      setTimeout(() => {
        set({
          activeSessions: Math.floor(Math.random() * 100),
          totalSessions24h: Math.floor(Math.random() * 1000),
        });
        get().addActivity('info', 'Dados do dashboard atualizados');
        resolve();
      }, 1000);
    });
    
    return promise;
  },
});

// Create and export the store
export const useDashboardStore = create<DashboardState & DashboardActions>(store);
