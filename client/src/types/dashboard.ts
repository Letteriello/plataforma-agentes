import type { AgentSummaryDTO } from '@/api/agentService';

/**
 * Defines the operational status of an agent.
 */
export type AgentStatus = 'online' | 'offline' | 'busy' | 'error';

/**
 * Extends the basic agent summary with dashboard-specific details.
 */
export interface DashboardAgent extends AgentSummaryDTO {
  status: AgentStatus;
  lastActive: string;
}

/**
 * Defines the type of a dashboard activity/log entry.
 */
export type ActivityType = 'info' | 'success' | 'warning' | 'error';

/**
 * Represents a single activity log entry on the dashboard.
 */
export interface Activity {
  id: string;
  type: ActivityType;
  message: string;
  timestamp: string;
}

/**
 * Represents a data point for token usage metrics.
 */
export interface TokenUsage {
  date: string;
  tokens: number;
}

/**
 * Represents the main statistics for the dashboard.
 */
export interface DashboardStats {
  activeAgentsCount: number;
  activeSessions: number;
  totalSessions24h: number;
}
