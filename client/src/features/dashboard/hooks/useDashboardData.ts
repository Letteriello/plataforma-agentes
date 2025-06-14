import { useEffect } from 'react'

import { useDashboardStore } from '@/store' // Updated path

export const useDashboardData = (period: string = '7d') => {
  // Select each piece of state individually to keep the snapshot stable
  const stats = useDashboardStore((state) => state.stats)
  const agents = useDashboardStore((state) => state.agents)
  const recentActivities = useDashboardStore((state) => state.recentActivities)
  const tokenUsage = useDashboardStore((state) => state.tokenUsage)
  const isLoading = useDashboardStore((state) => state.isLoading)
  const error = useDashboardStore((state) => state.error)
  const loadDashboardData = useDashboardStore(
    (state) => state.loadDashboardData,
  )

  useEffect(() => {
    loadDashboardData(period)
  }, [loadDashboardData, period])

  return {
    stats,
    agents,
    recentActivities,
    tokenUsage,
    isLoading,
    error,
    refreshData: () => loadDashboardData(period),
  }
}

export default useDashboardData
