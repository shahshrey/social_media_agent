from typing import Annotated, List, Optional

from pydantic import BaseModel, Field
from langchain_core.messages import (
    AnyMessage,
)
from backend.schema.schema import (
    ContentItem,
    Log,
)
from langgraph.graph.message import add_messages




class AgentState(BaseModel):
    messages: Annotated[List[AnyMessage], add_messages] = Field(default_factory=list)
    next_action: Annotated[Optional[str], Field(default=None)]
    content_items: Annotated[Optional[List[ContentItem]], Field(default=None)]
    generated_posts: Annotated[Optional[List[str]], Field(default=None)]
    writer_examples: Annotated[Optional[List[str]], Field(default=None)]
    logs: list[Log] = Field(default=[])
