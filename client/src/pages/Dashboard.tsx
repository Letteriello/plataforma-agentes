import { motion } from 'framer-motion'
// Icons
import { Bot, Clock,MessageSquare, TrendingUp } from 'lucide-react'
import React from 'react'

import { AgentActivityCard } from '@/features/dashboard/components/AgentActivityCard'
import { StatsCard } from '@/features/dashboard/components/StatsCard'
// Components
// import { DashboardLayout } from '@/components/dashboard/DashboardLayout'; // Removed
import { TokenUsageCard } from '@/features/dashboard/components/TokenUsageCard'
// Hooks
import { useDashboard } from '@/hooks/useDashboard'
import { useDashboardMetrics } from '@/hooks/useDashboardMetrics'
// Types
import { DashboardStats } from '@/features/dashboard/types'
// Removido: mock data agora é fornecido pelos hooks personalizados
// Utils
import { formatTokenNumber } from '@/utils/dashboardUtils'

const Dashboard: React.FC = () => {
  const { stats, loading, error, refresh, agents, tokenUsage, agentActivity } = useDashboard('7d');
  const [activityPeriod, setActivityPeriod] = React.useState('7d');

  const {
    stats: metricsStats,
    tokenMetrics,
  } = useDashboardMetrics(agents, tokenUsage);

  // Combina os dados de stats vindos dos hooks
  const combinedStats: DashboardStats | null = React.useMemo(() => {
    if (!stats && !metricsStats) return null;
    return {
      totalAgents: metricsStats?.totalAgents ?? stats?.totalAgents ?? 0,
      activeAgents: metricsStats?.activeAgents ?? stats?.activeAgents ?? 0,
      totalInteractions: stats?.totalInteractions ?? 0,
      successRate: stats?.successRate ?? 0,
      avgResponseTime: stats?.avgResponseTime ?? '0s',
      tokenUsage: metricsStats?.tokenUsage ?? stats?.tokenUsage ?? 0,
      activeSessions: stats?.activeSessions ?? 0,
    };
  }, [stats, metricsStats]);

  const handleRefresh = React.useCallback(() => {
    refresh()
  }, [refresh])

  

  // Os agentes agora são fornecidos pelos hooks (via useDashboardMetrics)
  // Se necessário, pode-se filtrar agentMetrics.agents diretamente

  return (
    <>
      {/* <DashboardLayout user={user}> */}
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Visão Geral</h1>
          <p className="text-sm text-muted-foreground">
            Monitoramento e análise do desempenho dos seus agentes
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {loading ? (
            // Skeleton loading state
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-32 bg-muted/30 rounded-lg animate-pulse"
              />
            ))
          ) : error ? (
            // Error state
            <div className="col-span-4 p-4 text-center text-destructive">
              Erro ao carregar os dados do dashboard. Tente novamente mais
              tarde.
            </div>
          ) : (
            // Actual stats
            combinedStats && (
              <>
                <StatsCard
                  title="Total de Agentes"
                  value={combinedStats.totalAgents?.toString() || '0'}
                  description={`${combinedStats.activeAgents || 0} ativos`}
                  icon={<Bot className="h-4 w-4" />}
                  trend="up"
                  trendValue="12%"
                />
                <StatsCard
                  title="Uso de Tokens"
                  value={formatTokenNumber(combinedStats.tokenUsage || 0)}
                  description={`${tokenMetrics.tokenPercentage}% do limite mensal`}
                  icon={<MessageSquare className="h-4 w-4" />}
                  trend={tokenMetrics.tokenPercentage > 80 ? 'up' : 'down'}
                  trendValue={`${tokenMetrics.tokenPercentage}%`}
                />
                <StatsCard
                  title="Taxa de Sucesso"
                  value={`${combinedStats.successRate || 0}%`}
                  description="Baseado nas últimas interações"
                  icon={<TrendingUp className="h-4 w-4" />}
                  trend={combinedStats.successRate >= 95 ? 'up' : 'down'}
                  trendValue={combinedStats.successRate >= 95 ? 'Alta' : 'Baixa'}
                />
                <StatsCard
                  title="Tempo de Resposta"
                  value={combinedStats.avgResponseTime || '0s'}
                  description="Média de resposta"
                  icon={<Clock className="h-4 w-4" />}
                  trend="down"
                  trendValue="-0.5s"
                />
              </>
            )
          )}
        </div>

        {/* Token Usage and Activity Cards */}
        <div className="grid gap-4 md:grid-cols-2">
          <TokenUsageCard
            data={tokenUsage}
            isLoading={loading}
          />
          <AgentActivityCard
            data={agentActivity}
            period={activityPeriod}
            onPeriodChange={setActivityPeriod}
            onRefresh={handleRefresh}
            isLoading={loading}
          />
        </div>
      </div>
    {/* </DashboardLayout> */}
    </>
  )
}

export default Dashboard
