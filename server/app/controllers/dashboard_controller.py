from fastapi import Depends, HTTPException
from supabase_py_async import AsyncClient as SupabaseClient
from typing import Dict, Any
from datetime import datetime, timedelta

from app.supabase_client import create_supabase_client_with_jwt
from app.models.user_model import User
from app.schemas.dashboard_schemas import RoiMetricsResponse, KpiCardMetric, RoiTimeSeriesResponse, TimeSeriesDataPoint

class DashboardController:

    async def get_roi_metrics(self, current_user: User, jwt_token: str) -> RoiMetricsResponse:
        db: SupabaseClient = create_supabase_client_with_jwt(jwt_token)
        user_id = str(current_user.id)

        try:
            # Fetch current and previous period metrics in parallel
            # NOTE: For simplicity, 'previous period' is the 30 days before the last 30 days.
            # This could be made more flexible with query parameters.
            end_date = datetime.utcnow()
            start_date_current = end_date - timedelta(days=30)
            start_date_previous = start_date_current - timedelta(days=30)

            rpc_params = {
                'p_user_id': user_id,
                'start_date_current': start_date_current.isoformat(),
                'end_date_current': end_date.isoformat(),
                'start_date_previous': start_date_previous.isoformat(),
                'end_date_previous': start_date_current.isoformat()
            }
            
            response = await db.rpc('get_roi_dashboard_metrics', rpc_params).execute()

            if not response.data:
                raise HTTPException(status_code=404, detail="No usage data found to generate metrics.")

            metrics = response.data[0]

            def calculate_change(current, previous):
                if previous > 0:
                    return ((current - previous) / previous) * 100
                return 100.0 if current > 0 else 0.0

            return RoiMetricsResponse(
                total_cost=KpiCardMetric(
                    value=metrics.get('total_cost_current', 0),
                    change=calculate_change(metrics.get('total_cost_current', 0), metrics.get('total_cost_previous', 0))
                ),
                total_tokens=KpiCardMetric(
                    value=metrics.get('total_tokens_current', 0),
                    change=calculate_change(metrics.get('total_tokens_current', 0), metrics.get('total_tokens_previous', 0))
                ),
                avg_cost_per_session=KpiCardMetric(
                    value=metrics.get('avg_cost_per_session_current', 0),
                    change=calculate_change(metrics.get('avg_cost_per_session_current', 0), metrics.get('avg_cost_per_session_previous', 0))
                ),
                cost_by_model=metrics.get('cost_by_model_current', {}),
                tokens_by_model=metrics.get('tokens_by_model_current', {})
            )

        except Exception as e:
            print(f"Error fetching ROI metrics: {e}")
            raise HTTPException(status_code=500, detail="Failed to fetch ROI metrics.")

    async def get_roi_time_series(self, current_user: User, jwt_token: str) -> RoiTimeSeriesResponse:
        db: SupabaseClient = create_supabase_client_with_jwt(jwt_token)
        user_id = str(current_user.id)
        
        try:
            end_date = datetime.utcnow()
            start_date = end_date - timedelta(days=30)

            rpc_params = {
                'p_user_id': user_id,
                'start_date': start_date.isoformat(),
                'end_date': end_date.isoformat()
            }

            response = await db.rpc('get_roi_time_series', rpc_params).execute()

            if not response.data:
                return RoiTimeSeriesResponse(series=[])

            return RoiTimeSeriesResponse(series=response.data)
        except Exception as e:
            print(f"Error fetching ROI time series: {e}")
            raise HTTPException(status_code=500, detail="Failed to fetch ROI time series data.")
