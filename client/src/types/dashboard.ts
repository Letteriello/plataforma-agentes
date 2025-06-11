export type AgentStatus = 'online' | 'offline' | 'idle' | 'busy'

export interface Agent {
  id: string
  name: string
  description: string
  status: AgentStatus
  type: 'chat' | 'assistant' | 'automation'
  lastActive: string
  usage: 'low' | 'medium' | 'high'
  usageStatus: 'low' | 'medium' | 'high'
  createdAt: string
  updatedAt: string
  createdBy: string
}

export interface DashboardStats {
  totalAgents: number
  totalInteractions: number
  successRate: number
  avgResponseTime: string
  tokenUsage: number
  activeAgents: number
  activeSessions: number
  [key: string]: string | number
}

export interface DashboardState {
  stats: DashboardStats | null
  loading: boolean
  error: Error | null
}

export interface Activity {
  id: string
  type: string
  message: string
  timestamp: string
  user: string
}

export interface TokenUsageData {
  date: string
  tokens: number
}

export interface AgentActivityData {
  date: string
  activeAgents: number
  interactions: number
}
