"""
Pytest configuration and fixtures
"""

import pytest
import asyncio
from datetime import datetime
from typing import Dict, Any

from app.models.status import ServiceStatus, ComponentStatus, StatusType


@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for the test session."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture
def sample_openai_response() -> Dict[str, Any]:
    """Sample OpenAI status API response"""
    return {
        "page": {
            "id": "kctbh9vrtdwd",
            "name": "OpenAI",
            "url": "https://status.openai.com",
            "time_zone": "Etc/UTC",
            "updated_at": "2023-12-01T10:00:00.000Z",
        },
        "status": {
            "indicator": "none",
            "description": "All Systems Operational",
        },
        "components": [
            {
                "id": "kr2cvy3gkt5s",
                "name": "ChatGPT",
                "status": "operational",
                "created_at": "2023-01-01T00:00:00.000Z",
                "updated_at": "2023-12-01T10:00:00.000Z",
                "position": 1,
                "description": None,
                "showcase": False,
                "start_date": None,
                "group_id": None,
                "page_id": "kctbh9vrtdwd",
                "group": False,
                "only_show_if_degraded": False,
            },
            {
                "id": "9g6h7j8k9l0m",
                "name": "API",
                "status": "operational",
                "created_at": "2023-01-01T00:00:00.000Z",
                "updated_at": "2023-12-01T10:00:00.000Z",
                "position": 2,
                "description": None,
                "showcase": False,
                "start_date": None,
                "group_id": None,
                "page_id": "kctbh9vrtdwd",
                "group": False,
                "only_show_if_degraded": False,
            },
        ],
    }


@pytest.fixture
def sample_service_status() -> ServiceStatus:
    """Sample ServiceStatus object"""
    return ServiceStatus(
        service_name="openai",
        overall_status=StatusType.OPERATIONAL,
        components=[
            ComponentStatus(
                id="kr2cvy3gkt5s",
                name="ChatGPT",
                status=StatusType.OPERATIONAL,
                updated_at=datetime.utcnow(),
            )
        ],
        description="All Systems Operational",
        page_url="https://status.openai.com/api/v2/status.json",
        updated_at=datetime.utcnow(),
    )
