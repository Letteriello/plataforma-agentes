import { create, StateCreator } from 'zustand'
import { v4 as uuidv4 } from 'uuid'
import {
  getDashboardStats,
  getRecentAgents,
  getRecentActivities,
  getTokenUsageMetrics,
  type DashboardStats,
  type TokenUsage,
} from '@/api/dashboardService'

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

interface DashboardState {
  stats: DashboardStats
  agents: Agent[]
  recentActivities: Activity[]
  tokenUsage: TokenUsage[]
  isLoading: boolean
  error: string | null
}

interface DashboardActions {
  updateAgentStatus: (id: string, status: AgentStatus) => void
  addActivity: (type: Activity['type'], message: string) => void
  loadDashboardData: (period?: string) => Promise<void>
}

const initialState: DashboardState = {
  stats: { activeAgentsCount: 0, activeSessions: 0, totalSessions24h: 0 },
  agents: [],
  recentActivities: [],
  tokenUsage: [],
  isLoading: false,
  error: null,
}

// Create the store with proper typing
const store: StateCreator<DashboardState & DashboardActions> = (set, get) => ({
  ...initialState,

  // Ações

  updateAgentStatus: (id: string, status: AgentStatus) => {
    set((state: DashboardState) => {
      const updatedAgents = state.agents.map((agent) =>
        agent.id === id ? { ...agent, status } : agent,
      )

      return {
        agents: updatedAgents,
        stats: {
          ...state.stats,
          activeAgentsCount: updatedAgents.filter((a) => a.status === 'online')
            .length,
        },
      }
    })
  },

  addActivity: (type: ActivityType, message: string) => {
    const newActivity: Activity = {
      id: uuidv4(),
      type,
      message,
      timestamp: new Date().toISOString(),
    }

    set((state: DashboardState) => ({
      recentActivities: [newActivity, ...state.recentActivities].slice(0, 50), // Limita a 50 atividades
    }))
  },

  loadDashboardData: async (period: string = '7d') => {
    set({ isLoading: true, error: null })
    try {
      const [stats, agents, activities, tokenUsage] = await Promise.all([
        getDashboardStats(),
        getRecentAgents(),
        getRecentActivities(),
        getTokenUsageMetrics(period),
      ])

      set({
        stats,
        agents,
        recentActivities: activities,
        tokenUsage,
        isLoading: false,
      })
    } catch (e) {
      const error =
        e instanceof Error ? e.message : 'Falha ao buscar dados do dashboard'
      set({ error, isLoading: false })
      console.error(error)
    }
  },
})

// Create and export the store
export const useDashboardStore = create<DashboardState & DashboardActions>(
  store,
)
