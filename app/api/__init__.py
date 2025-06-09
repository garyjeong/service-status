"""
API routers for AI Service Status Dashboard
"""

from .status import router as status_router
from .websocket import router as websocket_router

__all__ = ["status_router", "websocket_router"]
