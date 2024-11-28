import logging
from backend.automation.pages.feed_page import FeedPage
from playwright.async_api import async_playwright, Browser, Page, Playwright
from .pages.login_page import LoginPage

logger = logging.getLogger(__name__)

async def initialize_browser(headless: bool) -> tuple[Playwright, Browser, Page]:
    playwright = await async_playwright().start()
    browser = await playwright.chromium.launch(headless=headless)
    context = await browser.new_context()
    page = await context.new_page()
    return playwright, browser, page

async def close_browser(playwright: Playwright, browser: Browser) -> None:
    await browser.close()
    await playwright.stop()

async def login_to_linkedin(page: Page) -> None:
    login_page = LoginPage(page)
    await login_page.login()

async def post_to_linkedin(post: str):
    """Post content to LinkedIn using browser automation."""
    playwright, browser, page = await initialize_browser(headless=True)
    try:
        logger.info("Logging into LinkedIn...")
        await login_to_linkedin(page)
        feed_page = FeedPage(page)
        await feed_page.create_post(post)
        logger.info("Successfully created LinkedIn post")
    finally:
        logger.info("Closing browser...")
        await close_browser(playwright, browser)
    