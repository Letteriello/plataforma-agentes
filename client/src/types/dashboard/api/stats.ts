import { DashboardStats } from '../dashboard.types'

/**
 * Resposta da API para estatísticas do dashboard
 */
export interface DashboardStatsResponse {
  /** Dados das estatísticas */
  data: DashboardStats

  /** Timestamp da última atualização */
  lastUpdated: string

  /** Período de tempo coberto pelos dados */
  period: {
    start: string
    end: string
  }
}

/**
 * Parâmetros para buscar estatísticas
 */
export interface FetchStatsParams {
  /** Data de início do período (opcional) */
  startDate?: string

  /** Data de fim do período (opcional) */
  endDate?: string

  /** Agrupar por (dia, semana, mês) */
  groupBy?: 'day' | 'week' | 'month'

  /** IDs dos agentes para filtrar (opcional) */
  agentIds?: string[]
}
