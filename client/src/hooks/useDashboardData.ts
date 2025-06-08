import { useEffect } from 'react';
import { useDashboardStore } from '@/store/dashboardStore';

export const useDashboardData = () => {
  // Select each piece of state individually to keep the snapshot stable
  const stats = useDashboardStore(state => state.stats);
  const agents = useDashboardStore(state => state.agents);
  const recentActivities = useDashboardStore(state => state.recentActivities);
  const isLoading = useDashboardStore(state => state.isLoading);
  const error = useDashboardStore(state => state.error);
  const loadDashboardData = useDashboardStore(state => state.loadDashboardData);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  return {
    stats,
    agents,
    recentActivities,
    isLoading,
    error,
    refreshData: loadDashboardData,
  };
};

export default useDashboardData;
