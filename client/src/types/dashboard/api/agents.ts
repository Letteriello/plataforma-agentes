import { Agent } from '../dashboard.types'

/**
 * Resposta da API para lista de agentes
 */
export interface AgentsResponse {
  /** Lista de agentes */
  data: Agent[]

  /** Número total de agentes disponíveis */
  total: number

  /** Número da página atual */
  page: number

  /** Número de itens por página */
  limit: number

  /** Indica se há mais páginas disponíveis */
  hasMore: boolean
}

/**
 * Parâmetros para buscar agentes
 */
export interface FetchAgentsParams {
  /** Número da página (padrão: 1) */
  page?: number

  /** Número de itens por página (padrão: 10) */
  limit?: number

  /** Status para filtrar (opcional) */
  status?: Agent['status']

  /** Tipo para filtrar (opcional) */
  type?: Agent['type']

  /** Termo de busca (opcional) */
  search?: string

  /** Campo para ordenação (padrão: 'name') */
  sortBy?: 'name' | 'lastActive' | 'interactions' | 'successRate'

  /** Ordem de classificação (padrão: 'asc') */
  order?: 'asc' | 'desc'
}

/**
 * Dados para criar ou atualizar um agente
 */
export interface AgentFormData {
  /** Nome do agente */
  name: string

  /** Descrição do agente */
  description: string

  /** Tipo do agente */
  type: Agent['type']

  /** URL do avatar (opcional) */
  avatarUrl?: string

  /** Configurações específicas do agente */
  config?: Record<string, unknown>
}

/**
 * Resposta da API ao criar/atualizar um agente
 */
export interface AgentResponse {
  /** Dados do agente */
  data: Agent

  /** Mensagem de sucesso */
  message: string
}
