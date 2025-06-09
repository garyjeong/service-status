"""
Status API endpoints
"""

import logging
from typing import List
from fastapi import APIRouter, HTTPException, Query

from app.models.status import StatusResponse, ServiceStatus
from app.services.openai_service import OpenAIStatusService
from app.services.anthropic_service import AnthropicStatusService
from app.services.cursor_service import CursorStatusService

logger = logging.getLogger(__name__)

router = APIRouter(tags=["status"])


@router.get("/status", response_model=StatusResponse)
async def get_all_status(
    refresh_interval: int = Query(
        default=30, ge=5, le=300, description="Refresh interval in seconds"
    )
):
    """Get status for all AI services"""
    services = []

    # OpenAI Status
    try:
        async with OpenAIStatusService() as openai_service:
            openai_status = await openai_service.get_service_status()
            services.append(openai_status)
    except Exception as e:
        logger.error(f"Failed to get OpenAI status: {e}")
        # Continue with other services

    # Anthropic Status
    try:
        async with AnthropicStatusService() as anthropic_service:
            anthropic_status = await anthropic_service.get_service_status()
            services.append(anthropic_status)
    except Exception as e:
        logger.error(f"Failed to get Anthropic status: {e}")
        # Continue with other services

    # Cursor Status
    try:
        async with CursorStatusService() as cursor_service:
            cursor_status = await cursor_service.get_service_status()
            services.append(cursor_status)
    except Exception as e:
        logger.error(f"Failed to get Cursor status: {e}")
        # Continue with other services

    return StatusResponse(services=services, refresh_interval=refresh_interval)


@router.get("/status/{service_name}", response_model=ServiceStatus)
async def get_service_status(service_name: str):
    """Get status for a specific service"""
    service_name = service_name.lower()

    if service_name == "openai":
        async with OpenAIStatusService() as service:
            return await service.get_service_status()
    elif service_name == "anthropic":
        async with AnthropicStatusService() as service:
            return await service.get_service_status()
    elif service_name == "cursor":
        async with CursorStatusService() as service:
            return await service.get_service_status()
    else:
        raise HTTPException(
            status_code=404,
            detail=f"Service '{service_name}' not found. Available services: openai, anthropic, cursor",
        )
