from playwright.async_api import Page
import asyncio
from typing import List
from bs4 import BeautifulSoup
from backend.schema.schema import ContentItem
class ProfilePage:
    def __init__(self, page: Page):
        self.page = page
        self.base_url = "https://www.linkedin.com/in"
        self.linkedin_profile_name = "shreyshahh"

    async def navigate_to_profile(self):
        try:
            await self.page.goto(
                f"{self.base_url}/{self.linkedin_profile_name}/recent-activity/all/"
            )
        except TimeoutError:
            raise Exception(f"Failed to navigate to profile '{self.linkedin_profile_name}': Timeout")

    async def scroll_page(self, scrolls: int = 2):
        for _ in range(scrolls):
            await self.page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
            await asyncio.sleep(2)
        await asyncio.sleep(2)

    @staticmethod
    def parse_html_content(page_source: str) -> List[BeautifulSoup]:
        linkedin_soup = BeautifulSoup(page_source, "lxml")
        return [
            container
            for container in linkedin_soup.find_all(
                "div", {"class": "feed-shared-update-v2"}
            )
            if "activity" in container.get("data-urn", "")
        ]

    @staticmethod
    def get_post_content(container: BeautifulSoup) -> str:
        element = container.find("div", {"class": "update-components-text"})
        return element.text.strip() if element else ""

    async def get_linkedin_posts(self) -> List[ContentItem]:
        page_content = await self.page.content()
        containers = self.parse_html_content(page_content)
        return [
            ContentItem(title=f"LinkedIn Post {i+1}", content=self.get_post_content(container))
            for i, container in enumerate(containers)
            if self.get_post_content(container)
        ]

    async def scrape_linkedin_posts(self) -> List[ContentItem]:
        await self.navigate_to_profile()
        await asyncio.sleep(3)
        await self.scroll_page()
        posts = await self.get_linkedin_posts()
        return posts[:5]
