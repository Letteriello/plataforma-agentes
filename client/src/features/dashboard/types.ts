// Tipos consolidados para o domínio do Dashboard

import type { ReactNode } from 'react';

// --- Tipos de Métricas e ROI (do dashboard.ts) ---

export interface KpiCardMetric {
  value: number;
  change: number; // Represents the percentage change from the previous period
}

export interface RoiMetricsResponse {
  total_cost: KpiCardMetric;
  total_tokens: KpiCardMetric;
  avg_cost_per_session: KpiCardMetric;
  cost_by_model: Record<string, number>;
  tokens_by_model: Record<string, number>;
}

export interface TimeSeriesDataPoint {
  timestamp: string;
  cost: number;
  tokens: number;
}

export interface RoiTimeSeriesResponse {
  series: TimeSeriesDataPoint[];
}

// --- Tipos de UI e Estado (do dashboard.types.ts) ---

export type DashboardAgentStatus = 'online' | 'offline' | 'idle' | 'busy';

// Renomeado de 'Agent' para 'DashboardAgent' para evitar conflito com o tipo global de Agent.
export interface DashboardAgent {
  id: string;
  name: string;
  description: string;
  status: DashboardAgentStatus;
  type: 'chat' | 'assistant' | 'automation';
  lastActive: string;
  usage: 'low' | 'medium' | 'high';
  usageStatus: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface DashboardStats {
  totalAgents: number;
  totalInteractions: number;
  successRate: number;
  avgResponseTime: string;
  tokenUsage: number;
  activeAgents: number;
  activeSessions: number;
  [key: string]: string | number; // Para acesso dinâmico
}

export interface DashboardState {
  stats: DashboardStats | null;
  agents: DashboardAgent[];
  tokenUsage: TokenUsageData[];
  agentActivity: AgentActivityData[];
  loading: boolean;
  error: Error | null;
}

// Tipos para navegação
export interface NavItem {
  title: string;
  href: string;
  icon: ReactNode;
  disabled?: boolean;
}

// Tipos para o cabeçalho
export interface UserProfile {
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface DashboardHeaderProps {
  onMenuClick?: () => void;
  onSearch?: (query: string) => void;
  onNotificationClick?: () => void;
  user: UserProfile;
  className?: string;
}

// Tipos para a barra lateral
export interface DashboardSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

// --- Tipos para Componentes do Dashboard ---

// De AgentActivityCard.tsx
export interface AgentActivityData {
  date: string;
  activeAgents: number;
  interactions: number;
}

export interface AgentActivityCardProps {
  data: AgentActivityData[];
  period: string;
  onPeriodChange: (period: string) => void;
  onRefresh: () => void;
  isLoading?: boolean;
  className?: string;
}

// De TokenUsageCard.tsx e mockDashboardData.ts
export interface TokenUsageData {
  date: string;
  tokens: number;
}

export interface TokenUsageCardProps {
  data: TokenUsageData[];
  isLoading?: boolean;
  error?: string | null;
}

// De mockDashboardData.ts
export interface Activity {
  id: string;
  type: string;
  message: string;
  timestamp: string;
  user: string;
}

