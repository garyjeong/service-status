"""
Configuration management for AI Status Dashboard
"""

import os
from typing import Optional
from pydantic_settings import BaseSettings
from pydantic import ConfigDict


class Settings(BaseSettings):
    """Application settings"""

    # App Configuration
    app_name: str = "AI Service Status Dashboard"
    debug: bool = False
    host: str = "0.0.0.0"
    port: int = 8000

    # Refresh intervals (in seconds)
    min_refresh_interval: int = 5
    max_refresh_interval: int = 300
    default_refresh_interval: int = 30

    # Service URLs
    openai_status_url: str = "https://status.openai.com/proxy/status.openai.com"
    anthropic_status_url: str = (
        "https://status.anthropic.com/api/v2/status.json"
    )
    cursor_status_url: str = "https://status.cursor.com/api/v2/status.json"

    # Request Configuration
    request_timeout: int = 10
    max_retries: int = 3

    # Redis Configuration (optional)
    redis_url: Optional[str] = None
    cache_ttl: int = 30

    # Template Configuration
    templates_dir: str = "app/templates"
    static_dir: str = "app/static"

    model_config = ConfigDict(env_file=".env", case_sensitive=False)


# Global settings instance
settings = Settings()
