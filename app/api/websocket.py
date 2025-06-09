"""
WebSocket endpoints for real-time status updates
"""

import asyncio
import json
import logging
from typing import Set
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query

from app.services.status_service import StatusService

logger = logging.getLogger(__name__)

router = APIRouter(tags=["websocket"])


class ConnectionManager:
    """WebSocket connection manager"""

    def __init__(self):
        self.active_connections: Set[WebSocket] = set()

    async def connect(self, websocket: WebSocket):
        """Accept a WebSocket connection"""
        await websocket.accept()
        self.active_connections.add(websocket)
        logger.info(
            f"Client connected. Total connections: {len(self.active_connections)}"
        )

    def disconnect(self, websocket: WebSocket):
        """Remove a WebSocket connection"""
        self.active_connections.discard(websocket)
        logger.info(
            f"Client disconnected. Total connections: {len(self.active_connections)}"
        )

    async def send_personal_message(self, message: str, websocket: WebSocket):
        """Send message to specific client"""
        try:
            await websocket.send_text(message)
        except Exception as e:
            logger.error(f"Failed to send message to client: {e}")
            self.disconnect(websocket)

    async def broadcast(self, message: str):
        """Broadcast message to all connected clients"""
        if not self.active_connections:
            return

        # Create tasks for all sends
        tasks = []
        disconnected = set()

        for connection in self.active_connections.copy():
            try:
                task = connection.send_text(message)
                tasks.append(task)
            except Exception as e:
                logger.error(f"Failed to broadcast to client: {e}")
                disconnected.add(connection)

        # Remove disconnected clients
        for connection in disconnected:
            self.disconnect(connection)

        # Execute all sends concurrently
        if tasks:
            await asyncio.gather(*tasks, return_exceptions=True)


# Global connection manager
manager = ConnectionManager()


@router.websocket("/status")
async def websocket_status_endpoint(
    websocket: WebSocket,
    refresh_interval: int = Query(default=30, ge=5, le=300),
):
    """WebSocket endpoint for real-time status updates"""
    await manager.connect(websocket)
    status_service = StatusService()

    try:
        while True:
            try:
                # Get current status
                status_response = await status_service.get_all_statuses(
                    refresh_interval
                )

                # Convert to JSON
                message = {
                    "type": "status_update",
                    "data": status_response.dict(),
                    "timestamp": status_response.last_updated.isoformat(),
                }

                # Send to client
                await manager.send_personal_message(
                    json.dumps(message, default=str), websocket
                )

                # Wait for next update
                await asyncio.sleep(refresh_interval)

            except WebSocketDisconnect:
                break
            except Exception as e:
                logger.error(f"Error in WebSocket loop: {e}")
                # Send error message to client
                error_message = {
                    "type": "error",
                    "message": "Failed to fetch status data",
                    "timestamp": asyncio.get_event_loop().time(),
                }
                try:
                    await manager.send_personal_message(
                        json.dumps(error_message), websocket
                    )
                except:
                    break

                # Wait before retry
                await asyncio.sleep(min(refresh_interval, 10))

    except WebSocketDisconnect:
        logger.info("Client disconnected")
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
    finally:
        manager.disconnect(websocket)


@router.websocket("/ping")
async def websocket_ping_endpoint(websocket: WebSocket):
    """Simple ping/pong WebSocket for connection testing"""
    await websocket.accept()

    try:
        while True:
            # Wait for client message
            data = await websocket.receive_text()

            if data == "ping":
                await websocket.send_text("pong")
            else:
                await websocket.send_text(f"echo: {data}")

    except WebSocketDisconnect:
        logger.info("Ping client disconnected")
    except Exception as e:
        logger.error(f"Ping WebSocket error: {e}")
