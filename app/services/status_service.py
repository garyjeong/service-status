"""
Main status service that coordinates all AI service monitoring
"""

import asyncio
import logging
from typing import List, Dict, Optional
from datetime import datetime

from app.models.status import StatusResponse, ServiceStatus
from app.services.openai_service import OpenAIStatusService
from app.services.anthropic_service import AnthropicStatusService
from app.services.cursor_service import CursorStatusService
from app.services.google_aistudio_service import GoogleAIStudioStatusService

logger = logging.getLogger(__name__)


class StatusService:
    """Main service for coordinating AI service status checks"""

    def __init__(self):
        self._services = {
            "openai": OpenAIStatusService,
            "anthropic": AnthropicStatusService,
            "cursor": CursorStatusService,
            "google_aistudio": GoogleAIStudioStatusService,
        }

    async def get_all_statuses(
        self, refresh_interval: int = 30
    ) -> StatusResponse:
        """Get status for all services concurrently"""
        tasks = []

        # Create tasks for concurrent execution
        for service_name, service_class in self._services.items():
            task = self._get_service_status_safe(service_name, service_class)
            tasks.append(task)

        # Execute all tasks concurrently
        results = await asyncio.gather(*tasks, return_exceptions=True)

        # Filter out exceptions and collect valid results
        services = []
        for i, result in enumerate(results):
            if isinstance(result, Exception):
                service_name = list(self._services.keys())[i]
                logger.error(
                    f"Failed to get status for {service_name}: {result}"
                )
                # Create a fallback status for failed services
                services.append(self._create_fallback_status(service_name))
            else:
                services.append(result)

        return StatusResponse(
            services=services,
            refresh_interval=refresh_interval,
            last_updated=datetime.utcnow(),
        )

    async def get_service_status(self, service_name: str) -> ServiceStatus:
        """Get status for a specific service"""
        service_name = service_name.lower()

        if service_name not in self._services:
            raise ValueError(f"Unknown service: {service_name}")

        service_class = self._services[service_name]
        return await self._get_service_status_safe(service_name, service_class)

    async def _get_service_status_safe(
        self, service_name: str, service_class
    ) -> ServiceStatus:
        """Safely get service status with error handling"""
        try:
            async with service_class() as service:
                return await service.get_service_status()
        except Exception as e:
            logger.error(f"Error getting status for {service_name}: {e}")
            return self._create_fallback_status(service_name)

    def _create_fallback_status(self, service_name: str) -> ServiceStatus:
        """Create a fallback status when service check fails"""
        from app.models.status import StatusType
        from app.config import settings

        url_mapping = {
            "openai": settings.openai_status_url,
            "anthropic": settings.anthropic_status_url,
            "cursor": settings.cursor_status_url,
            "google_aistudio": settings.google_aistudio_status_url,
        }

        return ServiceStatus(
            service_name=service_name,
            overall_status=StatusType.UNKNOWN,
            components=[],
            description=f"Failed to retrieve status for {service_name}",
            page_url=url_mapping.get(service_name, ""),
            updated_at=datetime.utcnow(),
        )

    def get_available_services(self) -> List[str]:
        """Get list of available service names"""
        return list(self._services.keys())
