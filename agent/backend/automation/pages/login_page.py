from playwright.async_api import TimeoutError
import os

class LoginPage:
    def __init__(self, page):
        self.page = page
        self.email_input = page.get_by_label("Email or Phone")
        self.password_input = page.get_by_label("Password")
        self.login_button = page.locator('button[data-litms-control-urn="login-submit"]')

    async def login(self ):
        
        LINKEDIN_EMAIL=os.getenv("LINKEDIN_EMAIL")
        LINKEDIN_PASSWORD=os.getenv("LINKEDIN_PASSWORD")
        
        username = LINKEDIN_EMAIL
        password = LINKEDIN_PASSWORD
        await self.page.goto("https://www.linkedin.com/login")
        await self.email_input.fill(username)
        await self.password_input.fill(password)
        await self.login_button.click()
        try:
            await self.page.wait_for_url("https://www.linkedin.com/feed/", timeout=15000)
        except TimeoutError:
            raise Exception("Login failed: Timeout")