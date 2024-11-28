"""Demo"""

import os
from fastapi import FastAPI, HTTPException
import uvicorn
from copilotkit.integrations.fastapi import add_fastapi_endpoint
from copilotkit import CopilotKitSDK, LangGraphAgent
from backend.agent import workflow
import logging
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
load_dotenv()

# Configure logging BEFORE FastAPI app creation
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    force=True
)
logger = logging.getLogger(__name__)

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3005",
        "https://*.onrender.com",
        "https://edison-ai-ui-epie.vercel.app"
    ],
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

# add new route for health check
@app.get("/health")
def health():
    """Health check."""
    logger.info("Health check endpoint called")
    return {"status": "ok"}

# Add timeout configuration
TIMEOUT_SECONDS = int(os.getenv("REQUEST_TIMEOUT", "300"))  # 5 minutes default timeout

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
            content={"detail": "Request timed out"}
        )
    except Exception as exc:
        logger.error(f"Unhandled error: {str(exc)}")
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal server error"}
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



def main():
    """Run the uvicorn server."""
    port = int(os.getenv("PORT", "8001"))
    logger.info(f"Starting server on port {port}")
    uvicorn.run(
        "backend.app:app", 
        host="0.0.0.0", 
        port=port, 
        reload=True,
        log_level="info",
        access_log=True
    )
