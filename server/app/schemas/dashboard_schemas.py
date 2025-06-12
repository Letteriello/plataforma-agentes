from pydantic import BaseModel
from typing import List, Dict

class KpiCardMetric(BaseModel):
    value: float
    change: float # Represents the percentage change from the previous period

class RoiMetricsResponse(BaseModel):
    total_cost: KpiCardMetric
    total_tokens: KpiCardMetric
    avg_cost_per_session: KpiCardMetric
    cost_by_model: Dict[str, float]
    tokens_by_model: Dict[str, int]

class TimeSeriesDataPoint(BaseModel):
    timestamp: str
    cost: float
    tokens: int

class RoiTimeSeriesResponse(BaseModel):
    series: List[TimeSeriesDataPoint]
