from playwright.async_api import TimeoutError
import os
import logging

logger = logging.getLogger(__name__)

class LoginPage:
    def __init__(self, page):
        self.page = page
        self.email_input = page.get_by_label("Email or Phone")
        self.password_input = page.get_by_label("Password")
        self.login_button = page.locator('button[data-litms-control-urn="login-submit"]')

    async def login(self):
        """Handle LinkedIn login with proper error handling and logging."""
        email = os.getenv("LINKEDIN_EMAIL")
        password = os.getenv("LINKEDIN_PASSWORD")

        if not email or not password:
            raise ValueError("LinkedIn credentials not found in environment variables")

        try:
            logger.info("Navigating to LinkedIn login page")
            await self.page.goto("https://www.linkedin.com/login")
            
            logger.debug("Filling login credentials")
            await self.email_input.fill(email)
            await self.password_input.fill(password)
            
            logger.debug("Clicking login button")
            await self.login_button.click()

            logger.info("Waiting for redirect to feed page")
            await self.page.wait_for_url("https://www.linkedin.com/feed/", timeout=15000)
            
            logger.info("Login successful")
            
        except TimeoutError:
            logger.error("Login timeout - failed to redirect to feed page")
            raise Exception("Login failed: Timeout waiting for redirect")
        except Exception as e:
            logger.error(f"Login failed with error: {str(e)}")
            raise Exception(f"Login failed: {str(e)}")