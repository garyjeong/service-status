"""
Tests for OpenAI Status Service
"""

import pytest
from unittest.mock import AsyncMock, patch
from datetime import datetime

from app.services.openai_service import OpenAIStatusService
from app.models.status import StatusType


class TestOpenAIStatusService:
    """Test cases for OpenAI status service"""

    @pytest.fixture
    def service(self):
        """Create OpenAI service instance"""
        return OpenAIStatusService()

    @pytest.mark.asyncio
    async def test_parse_status_data_operational(
        self, service, sample_openai_response
    ):
        """Test parsing operational status response"""
        # Act
        result = await service.parse_status_data(sample_openai_response)

        # Assert
        assert result.service_name == "openai"
        assert result.overall_status == StatusType.OPERATIONAL
        assert result.description == "All Systems Operational"
        assert len(result.components) == 2
        assert result.components[0].name == "ChatGPT"
        assert result.components[0].status == StatusType.OPERATIONAL
        assert result.components[1].name == "API"
        assert result.components[1].status == StatusType.OPERATIONAL

    @pytest.mark.asyncio
    async def test_parse_status_data_degraded(self, service):
        """Test parsing degraded status response"""
        # Arrange
        degraded_response = {
            "status": {
                "indicator": "minor",
                "description": "Minor service degradation",
            },
            "components": [
                {
                    "id": "test1",
                    "name": "ChatGPT",
                    "status": "degraded_performance",
                    "updated_at": "2023-12-01T10:00:00.000Z",
                }
            ],
        }

        # Act
        result = await service.parse_status_data(degraded_response)

        # Assert
        assert result.overall_status == StatusType.DEGRADED_PERFORMANCE
        assert result.description == "Minor service degradation"
        assert result.components[0].status == StatusType.DEGRADED_PERFORMANCE

    def test_map_status_indicator(self, service):
        """Test status indicator mapping"""
        # Test all mappings
        assert service._map_status_indicator("none") == StatusType.OPERATIONAL
        assert (
            service._map_status_indicator("minor")
            == StatusType.DEGRADED_PERFORMANCE
        )
        assert (
            service._map_status_indicator("major") == StatusType.PARTIAL_OUTAGE
        )
        assert (
            service._map_status_indicator("critical") == StatusType.MAJOR_OUTAGE
        )
        assert (
            service._map_status_indicator("maintenance")
            == StatusType.UNDER_MAINTENANCE
        )
        assert service._map_status_indicator("unknown") == StatusType.UNKNOWN

    def test_parse_datetime_valid(self, service):
        """Test parsing valid datetime strings"""
        # Test ISO format
        date_str = "2023-12-01T10:00:00.000Z"
        result = service._parse_datetime(date_str)
        assert isinstance(result, datetime)

        # Test with timezone
        date_str_tz = "2023-12-01T10:00:00+00:00"
        result_tz = service._parse_datetime(date_str_tz)
        assert isinstance(result_tz, datetime)

    def test_parse_datetime_invalid(self, service):
        """Test parsing invalid datetime strings"""
        # Test invalid format - should return current time
        result = service._parse_datetime("invalid-date")
        assert isinstance(result, datetime)

        # Test empty string
        result_empty = service._parse_datetime("")
        assert isinstance(result_empty, datetime)

        # Test None
        result_none = service._parse_datetime(None)
        assert isinstance(result_none, datetime)

    @pytest.mark.asyncio
    async def test_get_service_status_success(
        self, service, sample_openai_response
    ):
        """Test successful status retrieval"""
        # Arrange
        with patch.object(
            service, "fetch_raw_data", new_callable=AsyncMock
        ) as mock_fetch:
            mock_fetch.return_value = sample_openai_response

            # Act
            async with service:
                result = await service.get_service_status()

            # Assert
            assert result.service_name == "openai"
            assert result.overall_status == StatusType.OPERATIONAL
            mock_fetch.assert_called_once()

    @pytest.mark.asyncio
    async def test_get_service_status_fetch_failure(self, service):
        """Test status retrieval when fetch fails"""
        # Arrange
        with patch.object(
            service, "fetch_raw_data", new_callable=AsyncMock
        ) as mock_fetch:
            mock_fetch.return_value = None

            # Act
            async with service:
                result = await service.get_service_status()

            # Assert
            assert result.service_name == "openai"
            assert result.overall_status == StatusType.UNKNOWN
            assert "Failed to fetch status data" in result.description

    @pytest.mark.asyncio
    async def test_get_service_status_parse_failure(self, service):
        """Test status retrieval when parsing fails"""
        # Arrange
        invalid_data = {"invalid": "data"}
        with patch.object(
            service, "fetch_raw_data", new_callable=AsyncMock
        ) as mock_fetch:
            mock_fetch.return_value = invalid_data

            # Act
            async with service:
                result = await service.get_service_status()

            # Assert
            assert result.service_name == "openai"
            assert result.overall_status == StatusType.UNKNOWN
            assert "Failed to parse status data" in result.description
