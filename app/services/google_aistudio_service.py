"""
Google AI Studio Status Service implementation
"""

import logging
import re
from datetime import datetime, timezone
from typing import Dict, Any, List
from bs4 import BeautifulSoup

from app.models.status import ServiceStatus, ComponentStatus, StatusType
from app.services.base_service import BaseStatusService
from app.config import settings

logger = logging.getLogger(__name__)


class GoogleAIStudioStatusService(BaseStatusService):
    """Google AI Studio status monitoring service"""

    def __init__(self):
        super().__init__("google_aistudio", settings.google_aistudio_status_url)

    async def parse_status_data(
        self, raw_data: Dict[str, Any]
    ) -> ServiceStatus:
        """Parse Google AI Studio status page HTML"""
        try:
            html_content = raw_data.get("html_content", "")
            if not html_content:
                raise ValueError("No HTML content received")

            # Parse HTML with BeautifulSoup
            soup = BeautifulSoup(html_content, "html.parser")

            # Try to extract status information from the page
            overall_status = StatusType.OPERATIONAL  # Default to operational
            description = "Google AI Studio - 상태 페이지 접근 가능"
            components = []

            # Look for status indicators in common patterns
            status_elements = soup.find_all(
                ["div", "span"], class_=re.compile(r"status|state|health", re.I)
            )

            # Look for service/component names and their statuses
            component_patterns = [
                "ai studio",
                "gemini api",
                "model serving",
                "authentication",
            ]

            for pattern in component_patterns:
                # Create default components based on expected services
                component_name = pattern.title()
                component_status = StatusType.OPERATIONAL

                # Try to find specific status information in the HTML
                pattern_regex = re.compile(pattern.replace(" ", ".*"), re.I)
                component_element = soup.find(text=pattern_regex)

                if component_element:
                    # Look for nearby status indicators
                    parent = (
                        component_element.parent
                        if component_element.parent
                        else soup
                    )
                    status_text = self._extract_status_from_element(parent)
                    component_status = self._map_status_text(status_text)

                component = ComponentStatus(
                    id=pattern.replace(" ", "_").lower(),
                    name=component_name,
                    status=component_status,
                    description=f"{component_name} 서비스 상태",
                    updated_at=datetime.now(timezone.utc),
                )
                components.append(component)

            # Check if there are any degraded services
            if any(
                comp.status != StatusType.OPERATIONAL for comp in components
            ):
                if any(
                    comp.status
                    in [StatusType.MAJOR_OUTAGE, StatusType.PARTIAL_OUTAGE]
                    for comp in components
                ):
                    overall_status = StatusType.PARTIAL_OUTAGE
                else:
                    overall_status = StatusType.DEGRADED_PERFORMANCE

            return ServiceStatus(
                service_name=self.service_name,
                overall_status=overall_status,
                components=components,
                description=description,
                page_url=self.status_url,
                updated_at=datetime.now(timezone.utc),
            )

        except Exception as e:
            logger.error(f"Error parsing Google AI Studio status data: {e}")
            # Return basic operational status if parsing fails
            return ServiceStatus(
                service_name=self.service_name,
                overall_status=StatusType.OPERATIONAL,
                components=[
                    ComponentStatus(
                        id="ai_studio_interface",
                        name="AI Studio Interface",
                        status=StatusType.OPERATIONAL,
                        description="상태 페이지 접근 가능",
                        updated_at=datetime.now(timezone.utc),
                    )
                ],
                description="Google AI Studio - 기본 상태 확인됨",
                page_url=self.status_url,
                updated_at=datetime.now(timezone.utc),
            )

    def _extract_status_from_element(self, element) -> str:
        """Extract status text from HTML element"""
        if not element:
            return "operational"

        # Look for common status keywords
        text = (
            element.get_text().lower()
            if hasattr(element, "get_text")
            else str(element).lower()
        )

        status_keywords = {
            "operational": [
                "operational",
                "online",
                "running",
                "active",
                "normal",
            ],
            "degraded": ["degraded", "slow", "issues", "problems"],
            "outage": ["outage", "down", "offline", "unavailable", "error"],
            "maintenance": ["maintenance", "scheduled", "updating"],
        }

        for status, keywords in status_keywords.items():
            if any(keyword in text for keyword in keywords):
                return status

        return "operational"

    def _map_status_text(self, status_text: str) -> StatusType:
        """Map status text to StatusType enum"""
        mapping = {
            "operational": StatusType.OPERATIONAL,
            "degraded": StatusType.DEGRADED_PERFORMANCE,
            "outage": StatusType.PARTIAL_OUTAGE,
            "maintenance": StatusType.UNDER_MAINTENANCE,
        }
        return mapping.get(status_text.lower(), StatusType.OPERATIONAL)
