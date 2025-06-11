import { Agent, DashboardStats } from '../dashboard.types'

/**
 * Props do componente StatsCard
 */
export interface StatsCardProps {
  /** Título do card */
  title: string

  /** Valor principal a ser exibido */
  value: string | number

  /** Descrição ou subtítulo */
  description?: string

  /** Ícone do card */
  icon?: React.ReactNode

  /** Tendência (up/down) */
  trend?: 'up' | 'down' | 'neutral'

  /** Valor da tendência */
  trendValue?: string | number

  /** Classe CSS adicional */
  className?: string
}

/**
 * Props do componente DashboardStatsGrid
 */
export interface DashboardStatsGridProps {
  /** Estatísticas a serem exibidas */
  stats: DashboardStats

  /** Indica se está carregando */
  loading?: boolean

  /** Classe CSS adicional */
  className?: string
}

/**
 * Props do componente AgentStatusCard
 */
export interface AgentStatusCardProps {
  /** Lista de agentes */
  agents: Agent[]

  /** Indica se está carregando */
  loading?: boolean

  /** Classe CSS adicional */
  className?: string

  /** Título personalizado */
  title?: string

  /** Máximo de agentes a serem exibidos */
  maxAgents?: number
}

/**
 * Props do componente TokenUsageCard
 */
export interface TokenUsageCardProps {
  /** Estatísticas para calcular o uso de tokens */
  stats: Pick<DashboardStats, 'tokenUsage' | 'totalInteractions'>

  /** Indica se está carregando */
  loading?: boolean

  /** Classe CSS adicional */
  className?: string

  /** Período de tempo para exibir (padrão: 7 dias) */
  period?: '7d' | '30d' | '90d'
}

/**
 * Props do componente AgentActivityCard
 */
export interface AgentActivityCardProps {
  /** Lista de agentes */
  agents: Agent[]

  /** Indica se está carregando */
  loading?: boolean

  /** Classe CSS adicional */
  className?: string

  /** Número máximo de atividades a serem exibidas */
  maxActivities?: number
}
