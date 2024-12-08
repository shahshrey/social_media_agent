from playwright.async_api import Page
import asyncio
from typing import List, Union
from bs4 import BeautifulSoup
from backend.schema.schema import ContentItem

class ProfilePage:
    def __init__(self, page: Page):
        self.page = page
        self.base_url = "https://www.linkedin.com/in"

    async def navigate_to_profile(self, linkedin_profile_id: str):
        try:
            await self.page.goto(
                f"{self.base_url}/{linkedin_profile_id}/recent-activity/all/"
            )
        except TimeoutError:
            raise Exception(f"Failed to navigate to profile '{linkedin_profile_id}': Timeout")

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
            ContentItem(content=self.get_post_content(container))
            for container in containers
            if self.get_post_content(container)
        ]

    async def scrape_linkedin_posts(self, linkedin_profile_ids: Union[str, List[str]], max_posts: int = 5) -> List[ContentItem]:

        profile_ids = [linkedin_profile_ids] if isinstance(linkedin_profile_ids, str) else linkedin_profile_ids
        
        all_posts = []
        for profile_id in profile_ids:
            try:
                await self.navigate_to_profile(profile_id)
                await asyncio.sleep(3)
                await self.scroll_page()
                posts = await self.get_linkedin_posts()
                all_posts.extend(posts[:max_posts])
            except Exception as e:
                print(f"Error scraping profile {profile_id}: {str(e)}")
                continue
                
        return all_posts
