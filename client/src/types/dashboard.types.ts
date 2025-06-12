// Tipos compartilhados para o Dashboard

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
  [key: string]: string | number // Para acesso dinâmico
}

export interface DashboardState {
  stats: DashboardStats | null
  loading: boolean
  error: Error | null
}

// Tipos para navegação
import type { ReactNode } from 'react'

export interface NavItem {
  title: string
  href: string
  icon: ReactNode
  disabled?: boolean
}

// Tipos para o cabeçalho
export interface UserProfile {
  name: string
  email: string
  avatarUrl?: string
}

export interface DashboardHeaderProps {
  onMenuClick?: () => void
  onSearch?: (query: string) => void
  onNotificationClick?: () => void
  user: UserProfile
  className?: string
}

// Tipos para a barra lateral
export interface DashboardSidebarProps {
  isOpen: boolean
  onToggle: () => void
  className?: string
}
