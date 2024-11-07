from playwright.async_api import Page, TimeoutError
import asyncio

class FeedPage:
    def __init__(self, page: Page):
        self.page = page
        self.start_post_button = page.get_by_role("button", name="Start a post")
        self.post_text_area = page.locator('.ql-editor[data-placeholder="Share your thoughts…"]')
        self.post_button = page.get_by_role("button", name="Post", exact=True)

    async def click_start_post(self):
        try:
            await self.start_post_button.click()
        except TimeoutError:
            raise Exception("Failed to open post creation modal: Timeout")

    async def create_post(self, content: str):
        try:
            await self.click_start_post()
            await self.post_text_area.fill(content)
            await asyncio.sleep(500)
            await self.post_button.click()
            await asyncio.sleep(50)
        except TimeoutError:
            raise Exception("Failed to create post: Timeout")

    async def wait_for_feed_load(self):
        try:
            await self.page.wait_for_selector('.feed-shared-update-v2', state='visible', timeout=15000)
        except TimeoutError:
            raise Exception("Feed failed to load: Timeout")
