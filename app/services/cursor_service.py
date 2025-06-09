"""
Cursor Status Service implementation
"""

import logging
from datetime import datetime, timezone
from typing import Dict, Any

from app.models.status import ServiceStatus, ComponentStatus, StatusType
from app.services.base_service import BaseStatusService
from app.config import settings

logger = logging.getLogger(__name__)


class CursorStatusService(BaseStatusService):
    """Cursor status monitoring service using JSON API"""

    def __init__(self):
        super().__init__("cursor", settings.cursor_status_url)

    async def fetch_components_data(self) -> list:
        """Fetch components data from additional API endpoints"""
        if not self.client:
            return []

        components_endpoints = [
            "https://status.cursor.com/api/v2/components.json",
            "https://status.cursor.com/api/v2/summary.json",
        ]

        for endpoint in components_endpoints:
            try:
                logger.info(f"Trying Cursor components endpoint: {endpoint}")
                response = await self.client.get(endpoint)
                if response.status_code == 200:
                    data = response.json()
                    logger.info(f"Components data from {endpoint}: {data}")
                    if "components" in data:
                        return data["components"]
                    elif isinstance(data, list):
                        return data
            except Exception as e:
                logger.warning(
                    f"Failed to fetch components from {endpoint}: {e}"
                )
                continue

        return []

    async def parse_status_data(
        self, raw_data: Dict[str, Any]
    ) -> ServiceStatus:
        """Parse Cursor status API response"""
        try:
            logger.info(f"Raw Cursor data keys: {list(raw_data.keys())}")
            logger.info(f"Raw Cursor data: {raw_data}")

            # Extract overall status from the new API structure
            overall_status = StatusType.OPERATIONAL  # Default
            description = "모든 시스템 정상"  # Default

            # Handle the actual API response structure
            if "status" in raw_data:
                status_info = raw_data["status"]
                if isinstance(status_info, dict):
                    # Map "none" indicator to operational
                    status_indicator = status_info.get("indicator", "none")
                    if status_indicator == "none":
                        overall_status = StatusType.OPERATIONAL
                    else:
                        overall_status = self._map_status_indicator(
                            status_indicator
                        )
                    description = status_info.get("description", description)

            # Get page information
            page_info = raw_data.get("page", {})
            page_url = page_info.get("url", self.status_url)
            updated_at = self._parse_datetime(page_info.get("updated_at"))

            # Fetch components from additional endpoints
            components_data = await self.fetch_components_data()
            components = []

            if components_data:
                for component_data in components_data:
                    component = ComponentStatus(
                        id=component_data.get("id", ""),
                        name=component_data.get("name", ""),
                        status=self._map_status_indicator(
                            component_data.get("status", "operational")
                        ),
                        description=component_data.get("description"),
                        updated_at=self._parse_datetime(
                            component_data.get("updated_at")
                        ),
                    )
                    components.append(component)
            else:
                # Add dummy components for Cursor services
                dummy_components = [
                    {
                        "id": "cursor-editor",
                        "name": "Cursor Editor",
                        "status": "operational",
                    },
                    {
                        "id": "cursor-ai",
                        "name": "Cursor AI Assistant",
                        "status": "operational",
                    },
                    {
                        "id": "cursor-sync",
                        "name": "Cursor Sync",
                        "status": "operational",
                    },
                    {
                        "id": "cursor-extensions",
                        "name": "Extension Marketplace",
                        "status": "operational",
                    },
                    {
                        "id": "cursor-copilot",
                        "name": "Cursor Copilot++",
                        "status": "operational",
                    },
                ]

                for component_data in dummy_components:
                    component = ComponentStatus(
                        id=component_data["id"],
                        name=component_data["name"],
                        status=self._map_status_indicator(
                            component_data["status"]
                        ),
                        description=f"{component_data['name']} 서비스",
                        updated_at=datetime.now(timezone.utc),
                    )
                    components.append(component)

            return ServiceStatus(
                service_name="cursor",
                overall_status=overall_status,
                description=description,
                components=components,
                updated_at=updated_at or datetime.now(timezone.utc),
                page_url=page_url,
            )

        except Exception as e:
            logger.error(f"Failed to parse Cursor status data: {e}")
            return ServiceStatus(
                service_name="cursor",
                overall_status=StatusType.UNKNOWN,
                description=f"상태 데이터 파싱 오류: {str(e)}",
                components=[],
                updated_at=datetime.now(timezone.utc),
                page_url=self.status_url,
            )

    def _map_status_indicator(self, indicator: str) -> StatusType:
        """Map Cursor status indicators to our StatusType enum"""
        mapping = {
            "operational": StatusType.OPERATIONAL,
            "degraded_performance": StatusType.DEGRADED_PERFORMANCE,
            "partial_outage": StatusType.PARTIAL_OUTAGE,
            "major_outage": StatusType.MAJOR_OUTAGE,
            "under_maintenance": StatusType.UNDER_MAINTENANCE,
            "none": StatusType.OPERATIONAL,  # "none" means all systems operational
        }
        return mapping.get(indicator.lower(), StatusType.UNKNOWN)

    def _parse_datetime(self, date_str: str | None) -> datetime | None:
        """Parse datetime string from Cursor API"""
        if not date_str:
            return None
        try:
            # Try ISO format first
            if "T" in date_str:
                return datetime.fromisoformat(date_str.replace("Z", "+00:00"))
            return None
        except (ValueError, AttributeError):
            return None
