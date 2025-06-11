import { Activity } from '../dashboard.types'

/**
 * Resposta da API para atividades recentes
 */
export interface ActivitiesResponse {
  /** Lista de atividades */
  data: Activity[]

  /** Número total de atividades disponíveis */
  total: number

  /** Número da página atual */
  page: number

  /** Número de itens por página */
  limit: number

  /** Indica se há mais páginas disponíveis */
  hasMore: boolean
}

/**
 * Parâmetros para buscar atividades
 */
export interface FetchActivitiesParams {
  /** Número da página (padrão: 1) */
  page?: number

  /** Número de itens por página (padrão: 10) */
  limit?: number

  /** Tipo de atividade para filtrar (opcional) */
  type?: Activity['type']

  /** ID do agente para filtrar (opcional) */
  agentId?: string

  /** ID do usuário para filtrar (opcional) */
  userId?: string

  /** Data de início para filtrar (opcional) */
  startDate?: string

  /** Data de fim para filtrar (opcional) */
  endDate?: string

  /** Ordenação (padrão: data decrescente) */
  sortBy?: 'newest' | 'oldest'
}
