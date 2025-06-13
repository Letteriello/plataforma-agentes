import { useCallback,useEffect, useState } from 'react'

import { DashboardState,DashboardStats } from '@/types/dashboard.types'

// Mock data - Em produção, isso viria de uma API
const MOCK_STATS: DashboardStats = {
  totalAgents: 12,
  totalInteractions: 1245,
  successRate: 94.5,
  avgResponseTime: '1.2s',
  tokenUsage: 45000,
  activeAgents: 8,
  activeSessions: 24,
}

export const useDashboard = (initialPeriod = '7d') => {
  const [period, setPeriod] = useState(initialPeriod)
  const [state, setState] = useState<DashboardState>({
    stats: null,
    loading: true,
    error: null,
  })

  // Função para buscar dados do dashboard
  const fetchDashboardData = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }))

    try {
      // Simulando chamada à API
      await new Promise((resolve) => setTimeout(resolve, 800))

      setState({
        stats: MOCK_STATS,
        loading: false,
        error: null,
      })
    } catch (error) {
      setState({
        stats: null,
        loading: false,
        error:
          error instanceof Error
            ? error
            : new Error('Erro ao carregar dados do dashboard'),
      })
    }
  }, [period])

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
