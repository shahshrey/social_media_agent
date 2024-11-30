import os
from pathlib import Path
import logging
from dotenv import load_dotenv

logger = logging.getLogger(__name__)

def load_environment():
    """Load environment variables from .env file."""
    root_dir = Path(__file__).resolve().parent.parent.parent
    env_path = root_dir / ".env"

    logger.info(f"Looking for .env file at: {env_path}")
    if env_path.exists():
        logger.info(f".env file found at {env_path}")
        load_dotenv(dotenv_path=env_path, override=True)
        
        # Debug: Print loaded environment variables
        logger.info("Loaded environment variables:")
        logger.info(f"ENVIRONMENT: {os.getenv('ENVIRONMENT', 'not set')}")
        logger.info(f"OPENAI_API_KEY: {'[SET]' if os.getenv('OPENAI_API_KEY') else '[NOT SET]'}")
    else:
        logger.warning(f".env file not found at {env_path}")

    # Verify critical environment variables
    if not os.getenv("OPENAI_API_KEY"):
        raise ValueError("OPENAI_API_KEY environment variable is required") 