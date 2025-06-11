/**
 * Tipos base para o Dashboard
 */

export type AgentStatus = 'online' | 'offline' | 'idle' | 'busy'
export type AgentType = 'chat' | 'assistant' | 'automation'

/**
 * Representa um agente no sistema
 */
export interface Agent {
  /** Identificador único do agente */
  id: string

  /** Nome de exibição do agente */
  name: string

  /** Descrição detalhada do agente */
  description: string

  /** Status atual do agente */
  status: AgentStatus

  /** Tipo do agente */
  type: AgentType

  /** URL da imagem de avatar do agente */
  avatarUrl?: string

  /** Data da última atividade do agente */
  lastActive: string

  /** Número total de interações */
  interactions?: number

  /** Taxa de sucesso (0-100) */
  successRate?: number
}

/**
 * Estatísticas do dashboard
 */
export interface DashboardStats {
  /** Número total de agentes */
  totalAgents: number

  /** Número total de interações */
  totalInteractions: number

  /** Taxa de sucesso (0-100) */
  successRate: number

  /** Tempo médio de resposta */
  avgResponseTime: string

  /** Uso de tokens */
  tokenUsage: number

  /** Número de agentes ativos */
  activeAgents: number

  /** Número de sessões ativas */
  activeSessions: number
}

/**
 * Atividade recente no sistema
 */
export interface Activity {
  id: string
  type: 'agent_created' | 'agent_updated' | 'interaction' | 'system'
  title: string
  description: string
  timestamp: string
  agentId?: string
  userId?: string
}

/**
 * Uso de tokens ao longo do tempo
 */
export interface TokenUsage {
  date: string
  inputTokens: number
  outputTokens: number
  totalTokens: number
}

/**
 * Estado do dashboard
 */
export interface DashboardState {
  /** Estatísticas do dashboard */
  stats: DashboardStats | null

  /** Lista de agentes */
  agents: Agent[]

  /** Atividades recentes */
  activities: Activity[]

  /** Uso de tokens ao longo do tempo */
  tokenUsage: TokenUsage[]

  /** Indica se os dados estão sendo carregados */
  loading: boolean

  /** Erro, se houver */
  error: Error | null
}
