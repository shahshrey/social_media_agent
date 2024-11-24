"""Demo"""

import os
from fastapi import FastAPI, UploadFile, File, HTTPException
import uvicorn
from copilotkit.integrations.fastapi import add_fastapi_endpoint
from copilotkit import CopilotKitSDK, LangGraphAgent
from edison_ai.agent import graph
import logging
import shutil
from fastapi.middleware.cors import CORSMiddleware
from starlette.background import BackgroundTask
from starlette.concurrency import run_in_threadpool
import asyncio
from fastapi import Request
from fastapi.responses import JSONResponse

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
            name="edison_ai",
            description="Edison AI agent.",
            agent=graph,
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

@app.post("/upload-audio")
async def upload_audio(file: UploadFile = File(...)):
    """Handle audio file upload."""
    try:
        logger.info(f"Receiving audio file: {file.filename}")
        
        # Create data directory if it doesn't exist
        data_dir = os.path.join(os.getcwd(), "data")
        os.makedirs(data_dir, exist_ok=True)
        
        # Save file to data directory
        file_path = os.path.join(data_dir, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        logger.info(f"Audio file saved to: {file_path}")
        return {"file_path": file_path}
    except Exception as e:
        logger.error(f"Error processing audio upload: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/copilotkit")
async def handle_copilotkit(request: Request):
    """Handle CopilotKit requests with proper error handling and cancellation."""
    try:
        # Create a new task group for better cancellation handling
        async with asyncio.TaskGroup() as tg:
            response = await tg.create_task(
                run_in_threadpool(
                    lambda: sdk.process_request(request)
                )
            )
        return response
    except asyncio.CancelledError:
        logger.warning("Request was cancelled by client")
        raise HTTPException(
            status_code=499,  # Client Closed Request
            detail="Request cancelled by client"
        )
    except Exception as e:
        logger.error(f"Error processing CopilotKit request: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
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
    except Exception as exc:
        logger.error(f"Unhandled error: {str(exc)}")
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal server error"}
        )

def main():
    """Run the uvicorn server."""
    port = int(os.getenv("PORT", "8000"))
    logger.info(f"Starting server on port {port}")
    uvicorn.run(
        "edison_ai.app:app", 
        host="0.0.0.0", 
        port=port, 
        reload=True,
        log_level="info",
        access_log=True
    )
