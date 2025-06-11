import apiClient from '@/api/apiClient'
// Assuming Agent and Activity types will be defined in a central place like @/types eventually.
// For now, if they are only in dashboardStore, this import might need adjustment post-refactor of stores.
// If these types are simple, they could also be defined here or imported from @/types if they exist there.
export type AgentStatus = 'online' | 'offline' | 'busy' | 'error'

export interface Agent {
  id: string
  name: string
  status: AgentStatus
  lastActive: string
  type: 'llm' | 'workflow' | 'tool'
}

export type ActivityType = 'info' | 'success' | 'warning' | 'error'

export interface Activity {
  id: string
  type: ActivityType
  message: string
  timestamp: string
}

export interface DashboardStats {
  activeAgentsCount: number
  activeSessions: number
  totalSessions24h: number
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await apiClient.get<DashboardStats>('/dashboard/stats')
  return response.data
}

export const getRecentAgents = async (): Promise<Agent[]> => {
  const response = await apiClient.get<Agent[]>('/dashboard/recent-agents')
  return response.data
}

export const getRecentActivities = async (): Promise<Activity[]> => {
  const response = await apiClient.get<Activity[]>(
    '/dashboard/recent-activities',
  )
  return response.data
}

export interface TokenUsage {
  date: string
  tokens: number
}

export const getTokenUsageMetrics = async (
  period: string = '7d',
): Promise<TokenUsage[]> => {
  const response = await apiClient.get<TokenUsage[]>(
    `/dashboard/token-usage?period=${period}`,
  )
  return response.data
}
