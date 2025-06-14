import { act,renderHook } from '@testing-library/react'
import { vi } from 'vitest'

import { useDashboardStore } from '@/store' // Updated path

import { useDashboardData } from './useDashboardData'

vi.mock('@/features/dashboard/store/dashboardStore') // Updated mock path

const mockLoadDashboardData = vi.fn()
const storeState = {
  stats: { activeAgentsCount: 1, activeSessions: 2, totalSessions24h: 3 },
  agents: [],
  recentActivities: [],
  tokenUsage: [],
  isLoading: false,
  error: null,
  loadDashboardData: mockLoadDashboardData,
}

describe('useDashboardData', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(useDashboardStore as unknown as vi.Mock).mockImplementation(
      (selector: (state: typeof storeState) => unknown) => selector(storeState),
    )
  })

  it('calls loadDashboardData on mount', () => {
    renderHook(() => useDashboardData('7d'))
    expect(mockLoadDashboardData).toHaveBeenCalledWith('7d')
  })

  it('refreshData triggers loadDashboardData again', () => {
    const { result } = renderHook(() => useDashboardData('30d'))
    act(() => {
      result.current.refreshData()
    })
    expect(mockLoadDashboardData).toHaveBeenCalledTimes(2)
    expect(mockLoadDashboardData).toHaveBeenLastCalledWith('30d')
  })

  it('returns values from the store', () => {
    const { result } = renderHook(() => useDashboardData())
    expect(result.current.stats).toEqual(storeState.stats)
    expect(result.current.agents).toEqual(storeState.agents)
    expect(result.current.recentActivities).toEqual(storeState.recentActivities)
    expect(result.current.tokenUsage).toEqual(storeState.tokenUsage)
  })
})
