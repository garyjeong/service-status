"""
Status data models for AI services
"""

from datetime import datetime
from enum import Enum
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class StatusType(str, Enum):
    """Status types for services and components"""

    OPERATIONAL = "operational"
    DEGRADED_PERFORMANCE = "degraded_performance"
    PARTIAL_OUTAGE = "partial_outage"
    MAJOR_OUTAGE = "major_outage"
    UNDER_MAINTENANCE = "under_maintenance"
    UNKNOWN = "unknown"


class ComponentStatus(BaseModel):
    """Individual component status"""

    id: str = Field(..., description="Component identifier")
    name: str = Field(..., description="Component name")
    status: StatusType = Field(..., description="Current status")
    description: Optional[str] = Field(None, description="Status description")
    updated_at: Optional[datetime] = Field(None, description="Last update time")


class ServiceStatus(BaseModel):
    """Overall service status"""

    service_name: str = Field(
        ..., description="Service name (openai, anthropic, cursor)"
    )
    overall_status: StatusType = Field(
        ..., description="Overall service status"
    )
    components: List[ComponentStatus] = Field(
        default_factory=list, description="Component statuses"
    )
    description: Optional[str] = Field(
        None, description="Overall status description"
    )
    updated_at: datetime = Field(
        default_factory=datetime.utcnow, description="Last update time"
    )
    page_url: str = Field(..., description="Status page URL")


class StatusResponse(BaseModel):
    """API response for status data"""

    services: List[ServiceStatus] = Field(
        ..., description="List of service statuses"
    )
    last_updated: datetime = Field(
        default_factory=datetime.utcnow, description="Response timestamp"
    )
    refresh_interval: int = Field(
        default=30, description="Refresh interval in seconds"
    )


class IncidentUpdate(BaseModel):
    """Incident update information"""

    id: str = Field(..., description="Update identifier")
    status: str = Field(..., description="Update status")
    body: str = Field(..., description="Update content")
    created_at: datetime = Field(..., description="Creation time")


class Incident(BaseModel):
    """Service incident information"""

    id: str = Field(..., description="Incident identifier")
    name: str = Field(..., description="Incident name")
    status: str = Field(..., description="Incident status")
    impact: str = Field(..., description="Impact level")
    created_at: datetime = Field(..., description="Creation time")
    updated_at: datetime = Field(..., description="Last update time")
    monitoring_at: Optional[datetime] = Field(
        None, description="Monitoring start time"
    )
    resolved_at: Optional[datetime] = Field(None, description="Resolution time")
    shortlink: Optional[str] = Field(None, description="Short URL to incident")
    updates: List[IncidentUpdate] = Field(
        default_factory=list, description="Incident updates"
    )
