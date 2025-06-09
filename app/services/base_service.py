"""
Base service class for status monitoring
"""

import asyncio
import logging
from abc import ABC, abstractmethod
from typing import Optional, Dict, Any
from datetime import datetime, timezone

import httpx
from app.models.status import ServiceStatus, StatusType
from app.config import settings


logger = logging.getLogger(__name__)


class BaseStatusService(ABC):
    """Base class for status monitoring services"""

    def __init__(self, service_name: str, status_url: str):
        self.service_name = service_name
        self.status_url = status_url
        self.client = None

    async def __aenter__(self):
        """Async context manager entry"""
        self.client = httpx.AsyncClient(
            timeout=settings.request_timeout,
            headers={"User-Agent": "AI-Status-Dashboard/1.0"},
        )
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Async context manager exit"""
        if self.client:
            await self.client.aclose()

    async def fetch_raw_data(self) -> Optional[Dict[str, Any]]:
        """Fetch raw data from status endpoint"""
        if not self.client:
            raise RuntimeError(
                "Service not initialized. Use async context manager."
            )

        for attempt in range(settings.max_retries):
            try:
                response = await self.client.get(self.status_url)
                response.raise_for_status()

                # Handle different response types
                content_type = response.headers.get("content-type", "").lower()
                if "application/json" in content_type:
                    return response.json()
                else:
                    return {"html_content": response.text}

            except httpx.HTTPError as e:
                logger.warning(
                    f"Attempt {attempt + 1} failed for {self.service_name}: {e}"
                )
                if attempt == settings.max_retries - 1:
                    logger.error(f"All attempts failed for {self.service_name}")
                    return None
                await asyncio.sleep(2**attempt)  # Exponential backoff

        return None

    @abstractmethod
    async def parse_status_data(
        self, raw_data: Dict[str, Any]
    ) -> ServiceStatus:
        """Parse raw data into ServiceStatus model"""
        pass

    async def get_service_status(self) -> ServiceStatus:
        """Get current service status"""
        raw_data = await self.fetch_raw_data()

        if raw_data is None:
            # Return unknown status on failure
            return ServiceStatus(
                service_name=self.service_name,
                overall_status=StatusType.UNKNOWN,
                description=f"Failed to fetch status data for {self.service_name}",
                page_url=self.status_url,
                updated_at=datetime.now(timezone.utc),
            )

        try:
            return await self.parse_status_data(raw_data)
        except Exception as e:
            logger.error(
                f"Failed to parse status data for {self.service_name}: {e}"
            )
            return ServiceStatus(
                service_name=self.service_name,
                overall_status=StatusType.UNKNOWN,
                description=f"Failed to parse status data: {str(e)}",
                page_url=self.status_url,
                updated_at=datetime.now(timezone.utc),
            )
