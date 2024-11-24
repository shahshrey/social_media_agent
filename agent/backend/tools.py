import os
from typing import List, Optional, Dict, Any

from langchain_openai import ChatOpenAI
import praw
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from langchain_core.messages import (
    HumanMessage,
    SystemMessage,
)
from openai import OpenAI
from pydantic import BaseModel
from youtube_transcript_api import YouTubeTranscriptApi
from langchain_core.tools import tool
from backend.prompts.prompts import reddit_summarization_prompt
from backend.schema.schema import (
    YouTubeURLParser,
    ContentItem,
)
from backend.utils.utils import (
    fetch_url_content,
    parse_article_content,
)
from backend.automation.browser import (
    initialize_browser,
    login_to_linkedin,
    close_browser,
)
from backend.automation.pages.profile_page import ProfilePage

load_dotenv()

model = ChatOpenAI(model="gpt-4o", temperature=0)
@tool
async def fetch_tds_articles():
    """
    Fetches the latest articles from Towards Data Science.
    
    Returns:
        ContentItem: A list of content items containing the latest articles.
    """
    content_items: List[ContentItem] = []
    page_content: Optional[str] = fetch_url_content(
        "https://towardsdatascience.com/latest"
    )
    if not page_content:
        return {"content_items": []}

    soup: BeautifulSoup = BeautifulSoup(page_content, "html.parser")
    for article in soup.find_all("div", class_="postArticle", limit=5):
        link_tag = article.find("a", {"data-action": "open-post"})
        if not link_tag:
            continue

        full_content: Optional[str] = parse_article_content(link_tag["href"])
        if full_content:
            content_items.append(ContentItem(content=full_content))

    return {"content_items": content_items}


@tool
async def fetch_linkedin_profile_posts():
    """
    Fetches the latest posts from the user's LinkedIn profile.
    
    Returns:
        ContentItem: A list of content items containing the latest posts.
    """

    playwright, browser, page = await initialize_browser(headless=False)
    try:
        await login_to_linkedin(page)
        profile_page = ProfilePage(page)
        content_items: List[ContentItem] = await profile_page.scrape_linkedin_posts()
        return {"content_items": content_items}
    finally:
        await close_browser(playwright, browser)


@tool
async def transcribe_audio():
    """
    Transcribes an audio file using the OpenAI API.
    
    Returns:
        ContentItem: A list of content items containing the transcribed audio.
    """
    audio_file: str = "./audio.mp3"
    openai_model: str = "whisper-1"
    client: OpenAI = OpenAI()
    with open(audio_file, "rb") as audio:
        transcription: str = client.audio.transcriptions.create(
            model=openai_model, file=audio, response_format="text"
        )
    return {"content_items": [ContentItem(content=transcription)]}


class TranscribeYoutubeInputSchema(BaseModel):
    url: Optional[str] = None


@tool(args_schema=TranscribeYoutubeInputSchema)
async def transcribe_youtube(input: TranscribeYoutubeInputSchema):
    """
    Transcribes a YouTube video using the YouTube Transcript API.
    
    Returns:
        ContentItem: A list of content items containing the transcribed video.
    """
    user_input = input.url if input.url else ""
    parsed_url: YouTubeURLParser = model.with_structured_output(
        YouTubeURLParser
    ).invoke(
        [
            SystemMessage(content="Parse the YouTube URL and return the video ID"),
            HumanMessage(content=user_input),
        ]
    )
    video_id: str = parsed_url.url.split("v=")[1]
    transcript: List[Dict[str, Any]] = YouTubeTranscriptApi.get_transcript(video_id)
    full_transcript: str = " ".join(entry["text"] for entry in transcript)
    return {"content_items": [ContentItem(content=full_transcript)]}



class SummarizeRedditInput(BaseModel):
    post_count: int = 5
    subreddit: str = "LangChain"

class SummarizeRedditInputSchema(BaseModel):
    params: SummarizeRedditInput

@tool(args_schema=SummarizeRedditInputSchema)
async def summarize_reddit(params: SummarizeRedditInput):
    """
    Summarizes the latest posts from a given Reddit subreddit using the PRAW API.
    
    Args:
        input (SummarizeRedditInputSchema): Contains post_count and subreddit parameters
    
    Returns:
        List[ContentItem]: A list of content items containing the summarized posts
    """
    content_items: List[ContentItem] = []
    reddit_config: Dict[str, str] = {
        k.lower()[5:]: v for k, v in os.environ.items() if k.startswith("PRAW_")
    }
    reddit: praw.Reddit = praw.Reddit(**reddit_config)
    subreddit_obj: praw.models.Subreddit = reddit.subreddit(params.subreddit)

    for submission in list(subreddit_obj.hot(limit=params.post_count))[1:]:
        submission.comments.replace_more(limit=None)
        summary_input: str = reddit_summarization_prompt.format(
            title=submission.title,
            body=submission.selftext or "No content",
            comments="\n".join(
                comment.body for comment in submission.comments.list()[:5]
            ),
        )
        summary: str = model.invoke([HumanMessage(content=summary_input)]).content
        content_items.append(ContentItem(content=summary))
    return content_items
