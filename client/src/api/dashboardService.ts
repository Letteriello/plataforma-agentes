import apiClient from '@/api/apiClient';
import type {
  Activity,
  DashboardAgent,
  DashboardStats,
  TokenUsage,
} from '@/types/dashboard';

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await apiClient.get<DashboardStats>('/dashboard/stats');
  return response.data;
};

export const getRecentAgents = async (): Promise<DashboardAgent[]> => {
  const response = await apiClient.get<DashboardAgent[]>('/dashboard/recent-agents');
  return response.data;
};

export const getRecentActivities = async (): Promise<Activity[]> => {
  const response = await apiClient.get<Activity[]>(
    '/dashboard/recent-activities',
  );
  return response.data;
};

export const getTokenUsageMetrics = async (
  period: string = '7d',
): Promise<TokenUsage[]> => {
  const response = await apiClient.get<TokenUsage[]>(
    `/dashboard/token-usage?period=${period}`,
  );
  return response.data;
};
