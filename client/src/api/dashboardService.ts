import apiClient from '../apiClient';
// Assuming Agent and Activity types will be defined in a central place like @/types eventually.
// For now, if they are only in dashboardStore, this import might need adjustment post-refactor of stores.
// If these types are simple, they could also be defined here or imported from @/types if they exist there.
import type { Agent, Activity } from '@/store/dashboardStore'; // Keeping for now

export interface DashboardStats {
  activeAgentsCount: number;
  activeSessions: number;
  totalSessions24h: number;
}

// Define types locally if not available from a central types file and to avoid dependency on store
// This is a good practice if these types are specific to API responses.
export interface RecentAgent {
  id: string;
  name: string;
  status: 'online' | 'busy' | 'offline'; // Example statuses
  lastActive: string; // ISO date string
  type: string; // Example type
}

export interface RecentActivity {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error'; // Example types
  message: string;
  timestamp: string; // ISO date string
}


export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await apiClient.get<DashboardStats>('/dashboard/stats');
  return response.data;
};

export const getRecentAgents = async (): Promise<RecentAgent[]> => {
  const response = await apiClient.get<RecentAgent[]>('/dashboard/recent-agents');
  return response.data;
};

export const getRecentActivities = async (): Promise<RecentActivity[]> => {
  const response = await apiClient.get<RecentActivity[]>('/dashboard/recent-activities');
  return response.data;
};
