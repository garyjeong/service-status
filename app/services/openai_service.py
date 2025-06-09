"""
OpenAI Status Service implementation
"""

import logging
from datetime import datetime, timezone
from typing import Dict, Any, List

from app.models.status import ServiceStatus, ComponentStatus, StatusType
from app.services.base_service import BaseStatusService
from app.config import settings

logger = logging.getLogger(__name__)


class OpenAIStatusService(BaseStatusService):
    """OpenAI status monitoring service"""

    def __init__(self):
        super().__init__("openai", settings.openai_status_url)

    async def parse_status_data(
        self, raw_data: Dict[str, Any]
    ) -> ServiceStatus:
        """Parse OpenAI status API response"""
        try:
            # Validate that we have a summary structure
            if "summary" not in raw_data:
                raise ValueError("Missing 'summary' field in response data")

            summary = raw_data.get("summary", {})

            # Extract overall status from summary or set as operational for now
            # The new API doesn't seem to have an overall status indicator
            overall_status = StatusType.OPERATIONAL  # Default to operational

            # Extract description
            description = summary.get("name", "OpenAI") + " - 상태 정보 조회됨"

            # Extract components from summary.components
            components = []
            for component_data in summary.get("components", []):
                # Get status from component_status if available
                component_status = StatusType.OPERATIONAL  # Default status

                # Check if there's status information in other parts of the response
                component_uptime_data = None
                for uptime_data in raw_data.get("uptime_data", []):
                    if uptime_data.get("component_id") == component_data.get(
                        "id"
                    ):
                        component_uptime_data = uptime_data
                        break

                component = ComponentStatus(
                    id=component_data.get("id", ""),
                    name=component_data.get("name", ""),
                    status=component_status,
                    description=f"구성 요소: {component_data.get('name', '')}",
                    updated_at=self._parse_datetime(
                        component_data.get("updated_at")
                    ),
                )
                components.append(component)

            return ServiceStatus(
                service_name=self.service_name,
                overall_status=overall_status,
                components=components,
                description=description,
                page_url=summary.get("public_url", self.status_url),
                updated_at=datetime.now(timezone.utc),
            )

        except Exception as e:
            logger.error(f"Error parsing OpenAI status data: {e}")
            raise

    def _map_status_indicator(self, indicator: str) -> StatusType:
        """Map OpenAI status indicators to our StatusType enum"""
        mapping = {
            "none": StatusType.OPERATIONAL,
            "minor": StatusType.DEGRADED_PERFORMANCE,
            "major": StatusType.PARTIAL_OUTAGE,
            "critical": StatusType.MAJOR_OUTAGE,
            "maintenance": StatusType.UNDER_MAINTENANCE,
            "operational": StatusType.OPERATIONAL,
            "degraded_performance": StatusType.DEGRADED_PERFORMANCE,
            "partial_outage": StatusType.PARTIAL_OUTAGE,
            "major_outage": StatusType.MAJOR_OUTAGE,
            "under_maintenance": StatusType.UNDER_MAINTENANCE,
        }
        return mapping.get(indicator.lower(), StatusType.UNKNOWN)

    def _parse_datetime(self, date_str: str) -> datetime:
        """Parse datetime string from API response"""
        if not date_str:
            return datetime.now(timezone.utc)

        try:
            # Handle ISO format with timezone
            if date_str.endswith("Z"):
                date_str = date_str[:-1] + "+00:00"
            return datetime.fromisoformat(date_str.replace("Z", "+00:00"))
        except (ValueError, AttributeError):
            logger.warning(f"Failed to parse datetime: {date_str}")
            return datetime.now(timezone.utc)
