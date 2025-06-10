"""
Status API endpoints
"""

import logging
from typing import List
from fastapi import APIRouter, HTTPException, Query

from app.models.status import StatusResponse, ServiceStatus
from app.services.status_service import StatusService

logger = logging.getLogger(__name__)

router = APIRouter(tags=["status"])


@router.get("/status", response_model=StatusResponse)
async def get_all_status(
    refresh_interval: int = Query(
        default=30, ge=5, le=300, description="Refresh interval in seconds"
    )
):
    """Get status for all AI services"""
    status_service = StatusService()
    return await status_service.get_all_statuses(refresh_interval)


@router.get("/status/{service_name}", response_model=ServiceStatus)
async def get_service_status(service_name: str):
    """Get status for a specific service"""
    status_service = StatusService()
    available_services = status_service.get_available_services()

    if service_name.lower() not in available_services:
        raise HTTPException(
            status_code=404,
            detail=f"Service '{service_name}' not found. Available services: {', '.join(available_services)}",
        )

    return await status_service.get_service_status(service_name)
