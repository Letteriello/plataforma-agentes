import { Bot, Clock, MessageSquare, TrendingUp } from 'lucide-react'

import { StatsCard } from '@/components/dashboard/StatsCard'
import { DashboardStats } from '@/types/dashboard'
import type { DashboardStatsGridProps } from '@/types/dashboard/components/cards'

/**
 * Grid de estatísticas do dashboard
 * @param stats - Estatísticas consolidadas
 * @param loading - Estado de carregamento
 */

export const DashboardStatsGrid = ({
  stats,
  loading = false,
}: DashboardStatsGridProps) => {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-muted/30 rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Agentes Ativos"
        value={`${stats.activeAgents}/${stats.totalAgents}`}
        description={`${Math.round((stats.activeAgents / stats.totalAgents) * 100) || 0}% ativos`}
        icon={<Bot className="h-4 w-4" />}
        trend="up"
        trendValue="+2"
      />
      <StatsCard
        title="Interações"
        value={stats.totalInteractions.toLocaleString()}
        description="+180 esta semana"
        icon={<MessageSquare className="h-4 w-4" />}
        trend="up"
        trendValue="+12.5%"
      />
      <StatsCard
        title="Taxa de Sucesso"
        value={`${stats.successRate}%`}
        description="+2.4% em relação ao mês passado"
        icon={<TrendingUp className="h-4 w-4" />}
        trend="up"
        trendValue="+2.4%"
      />
      <StatsCard
        title="Tempo de Resposta"
        value={stats.avgResponseTime}
        description="Média de resposta"
        icon={<Clock className="h-4 w-4" />}
        trend="down"
        trendValue="-0.5s"
      />
    </div>
  )
}
