import {
  Activity,
  DashboardAgent,
  AgentActivityData,
  TokenUsageData,
} from '@/features/dashboard/types'

export const mockAgents: DashboardAgent[] = [
  {
    id: '1',
    name: 'Assistente de Vendas',
    description: 'Atendimento ao cliente e vendas',
    status: 'online',
    type: 'chat',
    lastActive: '2 minutos atrás',
    usage: 'high',
    usageStatus: 'high',
    createdAt: '2023-01-15',
    updatedAt: '2023-10-20',
    createdBy: 'admin@exemplo.com',
  },
  {
    id: '2',
    name: 'Suporte Técnico',
    description: 'Resolução de problemas técnicos',
    status: 'idle',
    type: 'assistant',
    lastActive: '1 hora atrás',
    usage: 'low',
    usageStatus: 'low',
    createdAt: '2023-02-20',
    updatedAt: '2023-10-19',
    createdBy: 'admin@exemplo.com',
  },
  {
    id: '3',
    name: 'Automação de Tarefas',
    description: 'Automatiza tarefas repetitivas',
    status: 'busy',
    type: 'automation',
    lastActive: 'agora mesmo',
    usage: 'high',
    usageStatus: 'high',
    createdAt: '2023-03-10',
    updatedAt: '2023-10-21',
    createdBy: 'admin@exemplo.com',
  },
]

export const mockTokenUsage: TokenUsageData[] = [
  { date: '2023-01-01', tokens: 1000 },
  { date: '2023-01-02', tokens: 2000 },
  { date: '2023-01-03', tokens: 1500 },
  { date: '2023-01-04', tokens: 3000 },
  { date: '2023-01-05', tokens: 2500 },
  { date: '2023-01-06', tokens: 4000 },
  { date: '2023-01-07', tokens: 3500 },
]

export const mockAgentActivity: AgentActivityData[] = [
  { date: '2023-01-01', activeAgents: 3, interactions: 120 },
  { date: '2023-01-02', activeAgents: 4, interactions: 145 },
  { date: '2023-01-03', activeAgents: 2, interactions: 98 },
  { date: '2023-01-04', activeAgents: 5, interactions: 167 },
  { date: '2023-01-05', activeAgents: 3, interactions: 132 },
  { date: '2023-01-06', activeAgents: 4, interactions: 156 },
  { date: '2023-01-07', activeAgents: 5, interactions: 189 },
]

export const mockRecentActivities: Activity[] = [
  {
    id: '1',
    type: 'agent_created',
    message: 'Novo agente criado: Atendente Virtual',
    timestamp: new Date().toISOString(),
    user: 'João Silva',
  },
  {
    id: '2',
    type: 'agent_updated',
    message: 'Configurações do agente Atendente Virtual atualizadas',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    user: 'Maria Souza',
  },
  {
    id: '3',
    type: 'agent_deleted',
    message: 'Agente Antigo removido',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    user: 'Carlos Oliveira',
  },
  {
    id: '4',
    type: 'agent_updated',
    message: 'Modelo do Analista de Dados atualizado',
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    user: 'Ana Santos',
  },
  {
    id: '5',
    type: 'agent_created',
    message: 'Novo agente criado: Suporte Técnico',
    timestamp: new Date(Date.now() - 259200000).toISOString(),
    user: 'Pedro Alves',
  },
]
