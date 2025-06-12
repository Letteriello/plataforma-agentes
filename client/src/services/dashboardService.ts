import { apiClient } from './apiClient';
import { RoiMetricsResponse, RoiTimeSeriesResponse } from '@/types/dashboard';

const API_URL = '/dashboard';

export const dashboardService = {
  getRoiMetrics: async (): Promise<RoiMetricsResponse> => {
    try {
      const response = await apiClient.get<RoiMetricsResponse>(`${API_URL}/metrics`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch ROI metrics:', error);
      throw error;
    }
  },

  getRoiTimeSeries: async (): Promise<RoiTimeSeriesResponse> => {
    try {
      const response = await apiClient.get<RoiTimeSeriesResponse>(`${API_URL}/time-series`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch ROI time series data:', error);
      throw error;
    }
  },
};
