import { useMemo } from 'react'

import { Agent, DashboardStats,TokenUsageData } from '@/types/dashboard'

export const useDashboardMetrics = (
  agents: Agent[],
  tokenUsage: TokenUsageData[],
) => {
  // Calculate token metrics
  const tokenMetrics = useMemo(() => {
    const tokenLimit = 100000 // Example limit
    const totalTokensUsage = tokenUsage.reduce(
      (sum, item) => sum + item.tokens,
      0,
    )
    const tokenPercentage = Math.min(
      Math.round((totalTokensUsage / tokenLimit) * 100),
      100,
    )
    const remainingTokens = tokenLimit - totalTokensUsage

    return {
      tokenLimit,
      totalTokensUsage,
      tokenPercentage,
      remainingTokens,
      dailyAverage: Math.round(remainingTokens / 30),
    }
  }, [tokenUsage])

  // Calculate agent metrics
  const agentMetrics = useMemo(() => {
    const activeAgents = agents.filter(
      (agent) => agent.status === 'online' || agent.status === 'busy',
    ).length

    return {
      activeAgents,
      totalAgents: agents.length,
      activePercentage: Math.round((activeAgents / agents.length) * 100) || 0,
    }
  }, [agents])

  // Combine all stats
  const stats: DashboardStats = useMemo(
    () => ({
      totalAgents: agentMetrics.totalAgents,
      activeAgents: agentMetrics.activeAgents,
      totalInteractions: 0, // Will be updated from API
      successRate: 0, // Will be updated from API
      avgResponseTime: '0s', // Will be updated from API
      tokenUsage: tokenMetrics.totalTokensUsage,
      activeSessions: 0, // Will be updated from API
    }),
    [agentMetrics, tokenMetrics],
  )

  return {
    stats,
    tokenMetrics,
    agentMetrics,
  }
}
