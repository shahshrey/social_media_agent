"""Demo"""

import logging
import os

# Configure logging first
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    force=True
)
logger = logging.getLogger(__name__)

# Load environment before other imports
from backend.config import load_environment
load_environment()

from fastapi import FastAPI, HTTPException
import uvicorn
from copilotkit.integrations.fastapi import add_fastapi_endpoint
from copilotkit import CopilotKitSDK, LangGraphAgent
from backend.agent import workflow
from fastapi.middleware.cors import CORSMiddleware
from starlette.concurrency import run_in_threadpool
import asyncio
from fastapi import Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from backend.automation.browser import (
    post_to_linkedin,
)
from dotenv import load_dotenv 
import signal
import sys
from pathlib import Path

root_dir = Path(__file__).resolve().parent.parent.parent
env_path = root_dir / ".env"

# Configure logging BEFORE anything else
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    force=True
)
logger = logging.getLogger(__name__)

# Update the environment loading section
logger.info(f"Looking for .env file at: {env_path}")
if env_path.exists():
    logger.info(f".env file found at {env_path}")
    load_dotenv(dotenv_path=env_path, override=True)
    
    # Debug: Print loaded environment variables (excluding sensitive values)
    logger.info("Loaded environment variables:")
    logger.info(f"ENVIRONMENT: {os.getenv('ENVIRONMENT', 'not set')}")
    logger.info(f"OPENAI_API_KEY: {'[SET]' if os.getenv('OPENAI_API_KEY') else '[NOT SET]'}")
else:
    logger.warning(f".env file not found at {env_path}")

# Verify critical environment variables
openai_key = os.getenv("OPENAI_API_KEY")
if not openai_key:
    logger.error("OPENAI_API_KEY not found in environment variables")
    raise ValueError("OPENAI_API_KEY environment variable is required")

app = FastAPI()

# Environment configuration
ENVIRONMENT = os.getenv("ENVIRONMENT", "local")
BACKEND_PORT = int(os.getenv("BACKEND_PORT", "8000"))
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")

# Update CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

sdk = CopilotKitSDK(
    agents=[
        LangGraphAgent(
            name="Social Media Agent",
            description="A social media agent that can create posts on LinkedIn and Reddit.",
            graph=workflow,
        )
    ],
)


add_fastapi_endpoint(app, sdk, "/copilotkit")

# Add environment info to health check
@app.get("/health")
def health():
    """Health check."""
    logger.info("Health check endpoint called")
    return {
        "status": "ok",
        "environment": ENVIRONMENT
    }

# Update the timeout configuration
TIMEOUT_SECONDS = int(os.getenv("REQUEST_TIMEOUT", "600"))  # Increase to 10 minutes

@app.post("/copilotkit")
async def handle_copilotkit(request: Request):
    """Handle CopilotKit requests with proper error handling and cancellation."""
    try:
        logger.info("Received CopilotKit request")
        
        # Create timeout context
        async with asyncio.timeout(TIMEOUT_SECONDS):
            async with asyncio.TaskGroup() as tg:
                response = await tg.create_task(
                    run_in_threadpool(
                        lambda: sdk.process_request(request)
                    )
                )
            logger.info("Successfully processed CopilotKit request")
            return response
    except asyncio.TimeoutError:
        logger.error("Request timed out")
        raise HTTPException(
            status_code=504,
            detail="Request timed out"
        )
    except Exception as e:
        logger.error(f"Error processing CopilotKit request: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@app.middleware("http")
async def catch_exceptions_middleware(request: Request, call_next):
    """Global exception handler middleware."""
    try:
        return await call_next(request)
    except asyncio.CancelledError:
        logger.warning(f"Request to {request.url.path} was cancelled")
        return JSONResponse(
            status_code=499,
            content={"detail": "Request cancelled by client"}
        )
    except asyncio.TimeoutError:
        logger.error(f"Request to {request.url.path} timed out")
        return JSONResponse(
            status_code=504,
            content={"detail": "Request timed out. Please try again with a smaller request."}
        )
    except Exception as exc:
        logger.error(f"Unhandled error: {str(exc)}", exc_info=True)  # Add exc_info for better logging
        return JSONResponse(
            status_code=500,
            content={"detail": f"Internal server error: {str(exc)}"}
        )

class LinkedInPost(BaseModel):
    content: str
    

@app.post("/api/linkedin/post")
async def create_linkedin_post(post: LinkedInPost):
    """Create a new post on LinkedIn."""
    try:
        logger.info("Attempting to post to LinkedIn")
        await post_to_linkedin(post.content)
        logger.info("Successfully posted to LinkedIn")
        return {"status": "success", "message": "Post created successfully"}
    except Exception as e:
        logger.error(f"Failed to post to LinkedIn: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to post to LinkedIn: {str(e)}"
        )

# Add graceful shutdown handling
def signal_handler(sig, frame):
    logger.info("Received shutdown signal, cleaning up...")
    # Add cleanup logic here
    sys.exit(0)

signal.signal(signal.SIGTERM, signal_handler)
signal.signal(signal.SIGINT, signal_handler)

def main():
    """Run the uvicorn server."""
    logger.info(f"Starting server on port {BACKEND_PORT}")
    uvicorn.run(
        "backend.app:app", 
        host=os.getenv("HOSTNAME", "0.0.0.0"), 
        port=BACKEND_PORT,
        reload=True,
        log_level="info",
        access_log=True
    )
