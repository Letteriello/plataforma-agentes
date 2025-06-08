import { useEffect } from 'react';
import { useDashboardStore } from '@/store/dashboardStore';

export const useDashboardData = () => {
  const {
    stats,
    agents,
    recentActivities,
    isLoading,
    error,
    loadDashboardData,
  } = useDashboardStore(state => ({
    stats: state.stats,
    agents: state.agents,
    recentActivities: state.recentActivities,
    isLoading: state.isLoading,
    error: state.error,
    loadDashboardData: state.loadDashboardData,
  }));

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
