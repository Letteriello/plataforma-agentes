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
