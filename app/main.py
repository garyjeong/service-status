"""
FastAPI main application for AI Service Status Dashboard
"""

import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse

from app.config import settings
from app.api import status_router, websocket_router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage application lifespan"""
    logger.info("Starting AI Status Dashboard...")
    yield
    logger.info("Shutting down AI Status Dashboard...")


# Create FastAPI app
app = FastAPI(
    title=settings.app_name,
    version="1.0.0",
    description="Real-time monitoring dashboard for AI service statuses",
    lifespan=lifespan,
)

# Mount static files
app.mount("/static", StaticFiles(directory=settings.static_dir), name="static")

# Setup templates
templates = Jinja2Templates(directory=settings.templates_dir)

# Include routers
app.include_router(status_router, prefix="/api")
app.include_router(websocket_router, prefix="/ws")


@app.get("/", response_class=HTMLResponse)
async def dashboard(request: Request):
    """Main dashboard page"""
    return templates.TemplateResponse(
        "index.html",
        {
            "request": request,
            "title": settings.app_name,
            "default_refresh_interval": settings.default_refresh_interval,
            "min_refresh_interval": settings.min_refresh_interval,
            "max_refresh_interval": settings.max_refresh_interval,
        },
    )


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": settings.app_name}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug,
    )
