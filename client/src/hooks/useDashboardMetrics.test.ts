import { renderHook } from '@testing-library/react-hooks'
import { useDashboardMetrics } from './useDashboardMetrics'

const mockAgents = [
  {
    id: '1',
    name: 'Agente 1',
    status: 'online',
    type: 'chat',
    lastActive: '2025-06-10',
    usage: 'high',
    usageStatus: 'high',
    createdAt: '2025-01-01',
    updatedAt: '2025-06-10',
    createdBy: 'admin',
    description: '',
  },
  {
    id: '2',
    name: 'Agente 2',
    status: 'offline',
    type: 'assistant',
    lastActive: '2025-06-09',
    usage: 'low',
    usageStatus: 'low',
    createdAt: '2025-01-01',
    updatedAt: '2025-06-09',
    createdBy: 'admin',
    description: '',
  },
]

const mockTokenUsage = [
  { date: '2025-06-10', tokens: 1000 },
  { date: '2025-06-09', tokens: 2000 },
]

describe('useDashboardMetrics', () => {
  it('deve calcular corretamente as métricas dos agentes e tokens', () => {
    const { result } = renderHook(() =>
      useDashboardMetrics(mockAgents, mockTokenUsage),
    )
    expect(result.current.stats.totalAgents).toBe(2)
    expect(result.current.stats.activeAgents).toBe(1)
    expect(result.current.tokenMetrics.totalTokensUsage).toBe(3000)
    expect(result.current.tokenMetrics.tokenPercentage).toBeGreaterThanOrEqual(
      0,
    )
    expect(result.current.agentMetrics.agents.length).toBe(2)
  })

  it('deve retornar valores padrão para listas vazias', () => {
    const { result } = renderHook(() => useDashboardMetrics([], []))
    expect(result.current.stats.totalAgents).toBe(0)
    expect(result.current.tokenMetrics.totalTokensUsage).toBe(0)
    expect(result.current.agentMetrics.agents.length).toBe(0)
  })
})
