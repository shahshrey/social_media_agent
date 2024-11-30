from typing_extensions import TypedDict
from pydantic import BaseModel, Field, root_validator
from typing import Dict, Any, Optional

class WorkflowNodeType:
    ROUTER = "ROUTER"
    AUDIO_TRANSCRIPTION = "GET CONTENT FROM AUDIO"
    YOUTUBE_TRANSCRIPT = "GET CONTENT FROM YOUTUBE"
    REDDIT_SUMMARY = "GET CONTENT FROM REDDIT"
    TDS_ARTICLES = "GET CONTENT FROM TOWARDS DATA SCIENCE"
    LINKEDIN_PROFILE = "GET CONTENT FROM LINKEDIN PROFILE"
    CREATE_POST = "CREATE POST"
    LINKEDIN_POST = "POST TO LINKEDIN"


class AudioTranscriptionDecision(BaseModel):
    """
    Whether the user wants to create a post from audio
    """
    transcribe_audio: bool = Field(description="Whether to create a post from audio")
    reason: str = Field(description="Reason for the decision")
    
class YoutubeTranscriptionDecision(BaseModel):
    """
    Whether the user wants to create a post from youtube
    If the url is not provided, url MUST be set to 'URL NOT PROVIDED'
    """
    transcribe_youtube: bool = Field(description="Whether to create a post from YouTube")
    reason: str = Field(description="Reason for the decision")
    url: str = Field(description="""The YouTube URL to parse. If the url is not provided, url MUST be set to 'URL NOT PROVIDED' """)
    
class RedditSummaryDecision(BaseModel):
    """
    Whether the user wants to create a post from reddit
    """
    summarize_reddit: bool = Field(description="Whether to create a post from Reddit")
    reason: str = Field(description="Reason for the decision")
    
class TowardsDataScienceDecision(BaseModel):
    """
    Whether the user wants to create a post from towardsdatascience
    """
    fetch_tds_articles: bool = Field(description="Whether to create a post from Towards Data Science")
    reason: str = Field(description="Reason for the decision")

class LinkedInProfileDecision(BaseModel):
    """
    Whether the user wants to create a post from linkedin profile
    """
    fetch_linkedin_posts: bool = Field(description="Whether to create a post from LinkedIn profile")
    reason: str = Field(description="Reason for the decision")

class UserIntentClassification(BaseModel):
    """
    Use this to classify the user's intent, whether they want to create a post from audio, youtube, reddit, or towardsdatascience, 
    """
    reddit_summary_decision: RedditSummaryDecision
    towards_data_science_decision: TowardsDataScienceDecision
    linkedin_profile_decision: LinkedInProfileDecision
    audio_transcription_decision: AudioTranscriptionDecision
    youtube_transcription_decision: YoutubeTranscriptionDecision
    
class YouTubeURLParser(BaseModel):
    """
    Parse the YouTube URL from the user's input
    """
    url: str = Field(description="The YouTube URL to parse")
    
class RedditFetchParams(BaseModel):
    """
    Parse the number of posts and subreddit from the user's input
    """
    post_count: int = Field(description="The number of posts to fetch from Reddit")
    subreddit: str = Field(description="The subreddit to fetch posts from")
    

class ContentItem(BaseModel):
    """A string representing the content."""
    content: str = Field(description="The actual content")
    
    @root_validator(pre=True)
    def extract_content(cls, values: Dict[str, Any]) -> Dict[str, Any]:
        """Extract content from various possible formats."""
        if isinstance(values, dict):
            # Handle LangChain objects
            if 'lc' in values and 'type' in values:
                # Try to get content from common fields
                content = values.get('content') or values.get('text') or str(values)
                return {'content': content}
            # Handle direct content field
            elif 'content' in values:
                return values
        # Handle string input
        elif isinstance(values, str):
            return {'content': values}
        # Handle any other type by converting to string
        return {'content': str(values)}

class LinkedInPostDecision(BaseModel):
    should_post: bool = Field(description="Whether the user wants to post to LinkedIn")
    confidence: float = Field(description="Confidence level of the decision", ge=0, le=1)
    reasoning: str = Field(description="Explanation for the decision")
class Log(TypedDict):
    """
    Represents a log of an action performed by the agent.
    """
    message: str
    done: bool
