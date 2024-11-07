from playwright.async_api import async_playwright, Browser, Page, Playwright
from .pages.login_page import LoginPage

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