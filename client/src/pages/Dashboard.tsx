import React from 'react';
import { motion } from 'framer-motion';

// Components
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { TokenUsageCard } from '@/components/dashboard/TokenUsageCard';
import { AgentActivityCard } from '@/components/dashboard/AgentActivityCard';
import { StatsCard } from '@/components/dashboard/StatsCard';

// Hooks
import { useDashboard } from '@/hooks/useDashboard';
import { useDashboardMetrics } from '@/hooks/useDashboardMetrics';

// Types
import { Agent, DashboardStats } from '@/types/dashboard.types';

// Icons
import { Bot, MessageSquare, TrendingUp, Clock } from 'lucide-react';

// Mock data (temporary, will be replaced by API)
import { mockAgents, mockTokenUsage } from '@/data/mockDashboardData';

// Utils
import { formatTokenNumber } from '@/utils/dashboardUtils';

const Dashboard: React.FC = () => {
  const { 
    stats, 
    loading, 
    error, 
    refresh 
  } = useDashboard('7d');
  
  const { 
    stats: metricsStats,
    tokenMetrics,
    agentMetrics
  } = useDashboardMetrics(mockAgents, mockTokenUsage);

  // Combine stats from both hooks
  const combinedStats: DashboardStats = React.useMemo(() => ({
    totalAgents: 0,
    activeAgents: 0,
    totalInteractions: 0,
    successRate: 0,
    avgResponseTime: '0s',
    tokenUsage: 0,
    activeSessions: 0,
    ...(stats || {}),
    ...(metricsStats || {})
  }), [stats, metricsStats]);

  // Mock user data - in a real app, this would come from auth context
  const user = {
    name: 'Admin',
    email: 'admin@example.com',
    avatarUrl: '/path/to/avatar.jpg'
  };
  
  const handleRefresh = React.useCallback(() => {
    refresh();
  }, [refresh]);
  
  const handlePeriodChange = React.useCallback((newPeriod: string) => {
    // In a real app, this would update the period in the URL or state
    console.log('Period changed to:', newPeriod);
  }, []);
  
  // Filter agents by status for the stats
  const activeAgents = mockAgents.filter(agent => agent.status === 'online' || agent.status === 'busy');
  const idleAgents = mockAgents.filter(agent => agent.status === 'idle');
  const offlineAgents = mockAgents.filter(agent => agent.status === 'offline');

  return (
    <DashboardLayout user={user}>
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
              <div key={i} className="h-32 bg-muted/30 rounded-lg animate-pulse" />
            ))
          ) : error ? (
            // Error state
            <div className="col-span-4 p-4 text-center text-destructive">
              Erro ao carregar os dados do dashboard. Tente novamente mais tarde.
            </div>
          ) : (
            // Actual stats
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
          )}
        </div>
        
        {/* Token Usage and Activity Cards */}
        <div className="grid gap-4 md:grid-cols-2">
          <TokenUsageCard 
            data={mockTokenUsage}
            onRefresh={handleRefresh}
            loading={loading}
          />
          <AgentActivityCard 
            agents={mockAgents}
            onRefresh={handleRefresh}
            loading={loading}
          />
        </div>
      </div>
    </DashboardLayout>
                  description: 'Baseado nas últimas 1.234 requisições',
                  icon: 'check-circle',
                  trend: 'up',
                  trendValue: '2.3%',
                },
                {
                  title: 'Tempo Médio de Resposta',
                  value: '1.2s',
                  description: 'Redução de 15% na última semana',
                  icon: 'clock',
                  trend: 'down',
                  trendValue: '15%',
                },
              ]}
              loading={isLoading}
            />
          </div>

          {/* Charts Row */}
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 mb-6">
            <TokenUsageCard 
              data={mockTokenUsage} 
              period={period}
              onPeriodChange={handlePeriodChange}
              onRefresh={handleRefresh}
              isLoading={isLoading}
              className="h-[400px]"
            />
            
            <AgentActivityCard 
              data={mockAgents.map(agent => ({
                date: agent.lastActive,
                activeAgents: agent.status === 'online' || agent.status === 'busy' ? 1 : 0,
                interactions: 0, // This would come from real data
              }))}
              period={period}
              onPeriodChange={handlePeriodChange}
              onRefresh={handleRefresh}
              isLoading={isLoading}
              className="h-[400px]"
            />
          </div>

          {/* Recent Activity */}
          <div className="grid gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Atividade Recente</h2>
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Agente Atualizado</p>
                        <p className="text-xs text-gray-500">O agente de suporte ao cliente foi atualizado</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">2h atrás</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  Ver todas as atividades
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
