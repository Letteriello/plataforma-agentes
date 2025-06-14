import { useCallback, useEffect, useState } from 'react';
import { AgentActivityData, DashboardAgent, DashboardState, DashboardStats, TokenUsageData } from '@/features/dashboard/types';

// Mock data - Em produção, isso viria de uma API
const MOCK_STATS: DashboardStats = {
  totalAgents: 12,
  totalInteractions: 1245,
  successRate: 94.5,
  avgResponseTime: '1.2s',
  tokenUsage: 45000,
  activeAgents: 8,
  activeSessions: 24,
};

const MOCK_AGENTS: DashboardAgent[] = [
    { id: '1', name: 'Agent Smith', description: 'Chatbot', status: 'online', type: 'chat', lastActive: '2024-07-30T10:00:00Z', usage: 'low', usageStatus: 'low', createdAt: '2024-07-01T10:00:00Z', updatedAt: '2024-07-30T10:00:00Z', createdBy: 'admin' },
    { id: '2', name: 'Agent Jones', description: 'Assistant', status: 'offline', type: 'assistant', lastActive: '2024-07-29T10:00:00Z', usage: 'medium', usageStatus: 'medium', createdAt: '2024-07-01T11:00:00Z', updatedAt: '2024-07-29T10:00:00Z', createdBy: 'admin' },
];

const MOCK_TOKEN_USAGE: TokenUsageData[] = [
    { date: '2024-07-01', tokens: 1500 },
    { date: '2024-07-02', tokens: 2200 },
];

const MOCK_AGENT_ACTIVITY: AgentActivityData[] = [
    { date: '2024-07-01', activeAgents: 5, interactions: 120 },
    { date: '2024-07-02', activeAgents: 7, interactions: 150 },
    { date: '2024-07-03', activeAgents: 6, interactions: 135 },
];

export const useDashboard = (initialPeriod = '7d') => {
  const [period, setPeriod] = useState(initialPeriod);
  const [state, setState] = useState<DashboardState>({
    stats: null,
    agents: [],
    tokenUsage: [],
    agentActivity: [],
    loading: true,
    error: null,
  });

  const fetchDashboardData = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }));

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      setState({
        stats: MOCK_STATS,
        agents: MOCK_AGENTS,
        tokenUsage: MOCK_TOKEN_USAGE,
        agentActivity: MOCK_AGENT_ACTIVITY,
        loading: false,
        error: null,
      });
    } catch (error) {
      setState({
        stats: null,
        agents: [],
        tokenUsage: [],
        agentActivity: [],
        loading: false,
        error: error instanceof Error ? error : new Error('Erro ao carregar dados do dashboard'),
      });
    }
  }, [period]);

  // Efeito para carregar dados quando o período mudar
  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  // Função para atualizar o período
  const updatePeriod = useCallback((newPeriod: string) => {
    setPeriod(newPeriod)
  }, [])

  // Retornar estado e funções úteis
  return {
    ...state,
    period,
    updatePeriod,
    refresh: fetchDashboardData,
  }
}

// Hook para gerenciar o estado da barra lateral
export const useSidebar = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState)

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  const open = useCallback(() => {
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
  }, [])

  return {
    isOpen,
    toggle,
    open,
    close,
  }
}

// Hook para gerenciar busca
export const useSearch = (initialValue = '') => {
  const [searchQuery, setSearchQuery] = useState(initialValue)

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
    // Aqui você pode adicionar lógica de debounce se necessário
  }, [])

  return {
    searchQuery,
    handleSearch,
  }
}
