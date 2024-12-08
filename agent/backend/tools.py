import os
from typing import List, Optional, Dict, Any, Union
from pydantic import Field
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

model = ChatOpenAI(model="gpt-4o", temperature=0)

class FetchLinkedinProfilePostsInput(BaseModel):
    max_posts: int = Field(description="The maximum number of posts to fetch", default=5)
    linkedin_profile_id: Union[str, List[str]] = Field(
        description="The LinkedIn profile ID(s) to fetch posts from. Can be a single ID or list of IDs.",
        default=None
    )

class FetchLinkedinProfilePostsInputSchema(BaseModel):
    params: FetchLinkedinProfilePostsInput

@tool(args_schema=FetchLinkedinProfilePostsInputSchema)
async def fetch_linkedin_profile_posts(params: FetchLinkedinProfilePostsInput):
    """
    Fetches the latest posts from one or more LinkedIn profiles.
    
    Returns:
        ContentItem: A list of content items containing the latest posts from all profiles.
    """
    playwright, browser, page = await initialize_browser(headless=True)
    try:
        await login_to_linkedin(page)
        profile_page = ProfilePage(page)
        content_items: List[ContentItem] = await profile_page.scrape_linkedin_posts(
            linkedin_profile_ids=params.linkedin_profile_id,
            max_posts=params.max_posts
        )
        return content_items
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


class TranscribeYoutubeInput(BaseModel):
    url: str = Field(description="The URL of the YouTube video to transcribe", default=None)

class TranscribeYoutubeInputSchema(BaseModel):
    params: TranscribeYoutubeInput

@tool(args_schema=TranscribeYoutubeInputSchema)
async def transcribe_youtube(params: TranscribeYoutubeInput):
    """
    Transcribes a YouTube video using the YouTube Transcript API.
    
    Returns:
        ContentItem: A list of content items containing the transcribed video.
    """
    user_input = params.url if params.url else ""
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

    return [ContentItem(content=full_transcript)]


class SummarizeRedditInput(BaseModel):
    post_count: int = Field(description="The number of posts to summarize", default=5)
    subreddit: str = Field(description="The subreddit from which to fetch posts", default="LangChain")

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
    reddit_config.update({
        'requestor_kwargs': {'timeout': 30},
        'check_for_updates': False,
        'verify': False 
    })
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

class FetchTDSArticlesInput(BaseModel):
    count: int = Field(description="The number of articles to fetch", default=5)

class FetchTDSArticlesInputSchema(BaseModel):
    params: FetchTDSArticlesInput

@tool(args_schema=FetchTDSArticlesInputSchema)
async def fetch_tds_articles(params: FetchTDSArticlesInput):
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
        raise Exception("Failed to fetch articles")

    soup: BeautifulSoup = BeautifulSoup(page_content, "html.parser")
    for article in soup.find_all("div", class_="postArticle", limit=params.count):
        link_tag = article.find("a", {"data-action": "open-post"})
        if not link_tag:
            continue

        full_content: Optional[str] = parse_article_content(link_tag["href"])
        if full_content:
            content_items.append(ContentItem(content=full_content))

    return content_items