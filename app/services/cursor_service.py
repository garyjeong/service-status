"""
Cursor Status Service implementation
"""

import logging
from datetime import datetime
from typing import Dict, Any

from app.models.status import ServiceStatus, ComponentStatus, StatusType
from app.services.base_service import BaseStatusService
from app.config import settings

logger = logging.getLogger(__name__)


class CursorStatusService(BaseStatusService):
    """Cursor status monitoring service using JSON API"""

    def __init__(self):
        super().__init__("cursor", settings.cursor_status_url)

    async def parse_status_data(
        self, raw_data: Dict[str, Any]
    ) -> ServiceStatus:
        """Parse Cursor status API response"""
        try:
            # Validate that we have a status structure
            if "status" not in raw_data:
                raise ValueError("Missing 'status' field in response data")

            # Extract overall status
            status_indicator = raw_data.get("status", {}).get(
                "indicator", "unknown"
            )
            overall_status = self._map_status_indicator(status_indicator)

            # Extract description
            description = (
                raw_data.get("status", {}).get("description", "")
                or "Status information retrieved"
            )

            # Extract components
            components = []
            for component_data in raw_data.get("components", []):
                component = ComponentStatus(
                    id=component_data.get("id", ""),
                    name=component_data.get("name", ""),
                    status=self._map_status_indicator(
                        component_data.get("status", "unknown")
                    ),
                    description=component_data.get("description"),
                    updated_at=self._parse_datetime(
                        component_data.get("updated_at")
                    ),
                )
                components.append(component)

            return ServiceStatus(
                service_name="cursor",
                status=overall_status,
                description=description,
                components=components,
                last_updated=datetime.now(),
                source_url=self.url,
            )

        except Exception as e:
            logger.error(f"Failed to parse Cursor status data: {e}")
            return ServiceStatus(
                service_name="cursor",
                status=StatusType.UNKNOWN,
                description=f"Error parsing status data: {str(e)}",
                components=[],
                last_updated=datetime.now(),
                source_url=self.url,
            )

    def _map_status_indicator(self, indicator: str) -> StatusType:
        """Map Cursor status indicators to our StatusType enum"""
        mapping = {
            "operational": StatusType.OPERATIONAL,
            "degraded_performance": StatusType.DEGRADED_PERFORMANCE,
            "partial_outage": StatusType.PARTIAL_OUTAGE,
            "major_outage": StatusType.MAJOR_OUTAGE,
            "under_maintenance": StatusType.UNDER_MAINTENANCE,
            "none": StatusType.OPERATIONAL,
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
