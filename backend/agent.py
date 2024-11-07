import os
from typing import Annotated, List, Optional, Dict, Any

import praw
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from langchain_core.messages import AIMessage, AnyMessage, HumanMessage, SystemMessage, ToolMessage
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import END, StateGraph
from langgraph.graph.message import add_messages
from openai import OpenAI
from pydantic import BaseModel, Field
from youtube_transcript_api import YouTubeTranscriptApi

from backend.models.models import model
from backend.prompts.prompts import prompt, reddit_summarization_prompt, writer_examples
from backend.schema.schema import (
    UserIntentClassification,
    YouTubeURLParser,
    ContentItem,
    WorkflowNodeType,  # Updated class name
    LinkedInPostDecision,
)
from backend.utils.utils import (
    fetch_url_content,
    parse_article_content,
    save_post_to_csv,
)
from backend.automation.browser import (
    initialize_browser,
    login_to_linkedin,
    close_browser,
)
from backend.automation.pages.feed_page import FeedPage
from backend.automation.pages.profile_page import ProfilePage

load_dotenv()


class AgentState(BaseModel):
    messages: Annotated[List[AnyMessage], add_messages] = Field(default_factory=list)
    next_action: Annotated[Optional[str], Field(default=None)]
    content_items: Annotated[Optional[List[ContentItem]], Field(default=None)]
    generated_posts: Annotated[Optional[List[str]], Field(default=None)]


def determine_next_action(state: AgentState) -> str:
    return state.next_action or END


async def user_intent_classification(state: AgentState) -> Dict[str, Any]:
    system_message = """
    Classify the user's intent based on their messages, determining if they want to create a post from 
    audio, YouTube, Reddit, Towards Data Science, or LinkedIn profile.
    Extract any relevant information from the user's messages to help with classification.
    """

    print(state.messages)
    # Filter out ToolMessages
    filtered_messages = [msg for msg in state.messages if not isinstance(msg, ToolMessage)]
    user_intent: UserIntentClassification = await model.with_structured_output(
        UserIntentClassification, strict=True
    ).ainvoke(
        [
            SystemMessage(content=system_message),
            *filtered_messages,
        ]
    )
    return user_intent


async def content_router(state: AgentState) -> Dict[str, Any]:
    if not state.messages:
        return {
            "messages": [
                AIMessage(
                    content="Hello, what kind of post do you want to create? \nHere are the options:\n1. youtube\n2. reddit\n3. towardsdatascience\n4. audio transcript\n5. linkedin profile"
                )
            ],
            "next_action": END,
        }

    user_intent = await user_intent_classification(state)

    if user_intent.audio_transcription_decision.transcribe_audio:
        return {"next_action": WorkflowNodeType.AUDIO_TRANSCRIPTION}

    elif user_intent.youtube_transcription_decision.transcribe_youtube:
        if user_intent.youtube_transcription_decision.url == "URL NOT PROVIDED":
            return {"messages": [AIMessage(content="Please provide a YouTube URL")]}
        return {
            "next_action": WorkflowNodeType.YOUTUBE_TRANSCRIPT,
        }

    elif user_intent.reddit_summary_decision.summarize_reddit:
        return {"next_action": WorkflowNodeType.REDDIT_SUMMARY}

    elif user_intent.towards_data_science_decision.fetch_tds_articles:
        return {"next_action": WorkflowNodeType.TDS_ARTICLES}

    elif user_intent.linkedin_profile_decision.fetch_linkedin_posts:
        return {"next_action": WorkflowNodeType.LINKEDIN_PROFILE}

    else:
        return {"next_action": WorkflowNodeType.TDS_ARTICLES}


def fetch_tds_articles(state: AgentState) -> AgentState:
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


async def fetch_linkedin_profile_posts(state: AgentState) -> AgentState:
    playwright, browser, page = await initialize_browser(headless=False)
    try:
        await login_to_linkedin(page)
        profile_page = ProfilePage(page)
        content_items: List[ContentItem] = await profile_page.scrape_linkedin_posts()
        return {"content_items": content_items}
    finally:
        await close_browser(playwright, browser)


async def transcribe_audio(
    state: AgentState, audio_file: str = "./audio.mp3", openai_model: str = "whisper-1"
) -> AgentState:
    client: OpenAI = OpenAI()
    with open(audio_file, "rb") as audio:
        transcription: str = client.audio.transcriptions.create(
            model=openai_model, file=audio, response_format="text"
        )
    return {"content_items": [ContentItem(content=transcription)]}


async def transcribe_youtube(state: AgentState) -> AgentState:
    user_input = state.messages[-1].content if state.messages else ""
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
    return {
        "messages": [AIMessage(content=full_transcript)],
        "content_items": [ContentItem(content=full_transcript)]
    }


async def summarize_reddit(
    state: AgentState, post_count: int = 5, subreddit: str = "LangChain"
) -> AgentState:
    content_items: List[ContentItem] = []
    reddit_config: Dict[str, str] = {
        k.lower()[5:]: v for k, v in os.environ.items() if k.startswith("PRAW_")
    }
    reddit: praw.Reddit = praw.Reddit(**reddit_config)
    subreddit_obj: praw.models.Subreddit = reddit.subreddit(subreddit)

    for submission in list(subreddit_obj.hot(limit=post_count))[1:]:
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
    return {"content_items": content_items}


async def create_post(state: AgentState) -> AgentState:
    generated_posts: List[str] = []
    examples: str = writer_examples
    if state.content_items:
        print(f"Found {len(state.content_items)} content items")
        for content_item in state.content_items:
            final_prompt = prompt.format(examples=examples, topic=content_item.content)
            messages = [
                HumanMessage(content=final_prompt),
            ]
            response: AIMessage = await model.ainvoke(messages)
            save_post_to_csv(
                prompt, examples, content_item.content, response.content, final_prompt
            )
            print("=" * 50)
            print("=" * 50 + "\n" + response.content + "\n" + "=" * 50)
            print("=" * 50)
            generated_posts.append(response.content)
    return {"generated_posts": generated_posts}


async def should_post_to_linkedin(post: str) -> bool:
    user_input = input(
        f"Do you want to post this content to LinkedIn?\n\n{post}\n\nEnter 'yes' to post or 'no' to skip: "
    )

    analysis = await model.with_structured_output(LinkedInPostDecision).ainvoke(
        [
            SystemMessage(
                content="Analyze the user's response to determine if they want to post the content to LinkedIn. Provide a decision, confidence level, and reasoning."
            ),
            HumanMessage(content=f"User's response: {user_input}"),
        ]
    )

    print(f"Decision: {analysis.should_post}")
    print(f"Confidence: {analysis.confidence:.2f}")
    print(f"Reasoning: {analysis.reasoning}")

    return analysis.should_post


async def post_to_linkedin(state: AgentState) -> None:
    posts: Optional[List[str]] = state.generated_posts
    if not posts:
        return

    playwright, browser, page = await initialize_browser(headless=False)
    try:
        await login_to_linkedin(page)
        feed_page = FeedPage(page)
        for post in posts:
            if await should_post_to_linkedin(post):
                print("Posting to LinkedIn")
                await feed_page.create_post(post)
            else:
                print("Skipping this post.")
    finally:
        await close_browser(playwright, browser)
    return {
        "messages": [
            AIMessage(
                content="Post created on LinkedIn. Do you want to create another post from any other source?"
            )
        ]
    }


router_paths: Dict[str, str] = {
    WorkflowNodeType.AUDIO_TRANSCRIPTION: WorkflowNodeType.AUDIO_TRANSCRIPTION,
    WorkflowNodeType.YOUTUBE_TRANSCRIPT: WorkflowNodeType.YOUTUBE_TRANSCRIPT,
    WorkflowNodeType.REDDIT_SUMMARY: WorkflowNodeType.REDDIT_SUMMARY,
    WorkflowNodeType.TDS_ARTICLES: WorkflowNodeType.TDS_ARTICLES,
    WorkflowNodeType.LINKEDIN_PROFILE: WorkflowNodeType.LINKEDIN_PROFILE,
    END: END,
}


def build_workflow() -> StateGraph:
    workflow: StateGraph = StateGraph(AgentState)
    workflow.add_node(WorkflowNodeType.ROUTER, content_router)
    workflow.add_node(WorkflowNodeType.AUDIO_TRANSCRIPTION, transcribe_audio)
    workflow.add_node(WorkflowNodeType.YOUTUBE_TRANSCRIPT, transcribe_youtube)
    workflow.add_node(WorkflowNodeType.REDDIT_SUMMARY, summarize_reddit)
    workflow.add_node(WorkflowNodeType.TDS_ARTICLES, fetch_tds_articles)
    workflow.add_node(WorkflowNodeType.LINKEDIN_PROFILE, fetch_linkedin_profile_posts)
    workflow.add_node(WorkflowNodeType.CREATE_POST, create_post)
    workflow.add_node(WorkflowNodeType.LINKEDIN_POST, post_to_linkedin)
    workflow.set_entry_point(WorkflowNodeType.ROUTER)
    workflow.add_conditional_edges(
        WorkflowNodeType.ROUTER, determine_next_action, router_paths
    )
    workflow.add_edge(
        WorkflowNodeType.AUDIO_TRANSCRIPTION, WorkflowNodeType.CREATE_POST
    )
    workflow.add_edge(WorkflowNodeType.YOUTUBE_TRANSCRIPT, WorkflowNodeType.CREATE_POST)
    workflow.add_edge(WorkflowNodeType.REDDIT_SUMMARY, WorkflowNodeType.CREATE_POST)
    workflow.add_edge(WorkflowNodeType.TDS_ARTICLES, WorkflowNodeType.CREATE_POST)
    workflow.add_edge(WorkflowNodeType.LINKEDIN_PROFILE, WorkflowNodeType.CREATE_POST)
    workflow.add_edge(WorkflowNodeType.CREATE_POST, WorkflowNodeType.LINKEDIN_POST)
    workflow.add_edge(WorkflowNodeType.LINKEDIN_POST, END)

    return workflow


# Main execution
workflow_builder: StateGraph = build_workflow()
memory: MemorySaver = MemorySaver()
workflow: Any = workflow_builder.compile(checkpointer=memory)
