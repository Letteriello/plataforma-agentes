import { RoiMetricsResponse, RoiTimeSeriesResponse } from '@/types/dashboard';

import { apiClient } from './apiClient';

const API_URL = '/dashboard';

export const dashboardService = {
  getRoiMetrics: async (): Promise<RoiMetricsResponse> => {
    const response = await apiClient.get<RoiMetricsResponse>(`${API_URL}/metrics`);
    return response.data;
  },

  getRoiTimeSeries: async (): Promise<RoiTimeSeriesResponse> => {
    const response = await apiClient.get<RoiTimeSeriesResponse>(`${API_URL}/time-series`);
    return response.data;
  },
};
