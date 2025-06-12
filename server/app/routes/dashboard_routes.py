from fastapi import APIRouter, Depends, HTTPException
from typing import List

from app.controllers.dashboard_controller import DashboardController
from app.schemas.dashboard_schemas import RoiMetricsResponse, RoiTimeSeriesResponse
from app.models.user_model import User
from app.security import get_current_user_with_token

router = APIRouter()

@router.get("/metrics", response_model=RoiMetricsResponse)
async def get_roi_metrics(
    user_with_token: tuple[User, str] = Depends(get_current_user_with_token),
    controller: DashboardController = Depends(DashboardController)
):
    """
    Get aggregated ROI metrics for the dashboard KPIs.
    """
    current_user, jwt_token = user_with_token
    return await controller.get_roi_metrics(current_user=current_user, jwt_token=jwt_token)

@router.get("/time-series", response_model=RoiTimeSeriesResponse)
async def get_roi_time_series(
    user_with_token: tuple[User, str] = Depends(get_current_user_with_token),
    controller: DashboardController = Depends(DashboardController)
):
    """
    Get time series data for ROI charts.
    """
    current_user, jwt_token = user_with_token
    return await controller.get_roi_time_series(current_user=current_user, jwt_token=jwt_token)
