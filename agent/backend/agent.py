from typing import List

from dotenv import load_dotenv
from langchain_core.messages import (
    AIMessage,
    HumanMessage,
    SystemMessage,
    ToolMessage,
)
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import END, StateGraph
from langchain_openai import ChatOpenAI
from backend.prompts.prompts import prompt, writer_examples, TOOLS_SYSTEM_PROMPT
from backend.schema.schema import (
    LinkedInPostDecision,
)
from backend.utils.utils import save_post_to_csv
from backend.automation.browser import (
    initialize_browser,
    login_to_linkedin,
    close_browser,
)
from backend.automation.pages.feed_page import FeedPage
from backend.tools import (
    fetch_tds_articles,
    summarize_reddit,
    transcribe_audio,
    transcribe_youtube,
    fetch_linkedin_profile_posts,
)
from backend.schema.state import AgentState

print("Loading environment variables...")
load_dotenv()

print("Initializing tools...")
TOOLS = [
    fetch_tds_articles,
    summarize_reddit,
    transcribe_audio,
    transcribe_youtube,
    fetch_linkedin_profile_posts,
]


class Agent:
    def __init__(self):
        print("Initializing Agent...")
        self.tools = {t.name: t for t in TOOLS}
        print(f"Available tools: {list(self.tools.keys())}")
        self.tool_calling_model = ChatOpenAI(model="gpt-4o").bind_tools(TOOLS)
        self.model = ChatOpenAI(model="gpt-4o", temperature=0)
        self.state = AgentState()
        self.build_workflow()

    def build_workflow(self):
        print("Building workflow...")
        workflow = StateGraph(AgentState)
        workflow.add_node("call_tools_llm", self.call_tools_llm)
        workflow.add_node("invoke_tools", self.invoke_tools)
        workflow.add_node("create_post", self.create_post)
        workflow.add_node("post_to_linkedin", self.post_to_linkedin)
        workflow.add_node("chat_with_user", self.chat_with_user)
        workflow.set_entry_point("call_tools_llm")

        print("Adding workflow edges...")
        workflow.add_conditional_edges(
            "call_tools_llm",
            self.determine_next_action,
            {
                "more_tools": "invoke_tools",
                "create_post": "create_post",
                "post_to_linkedin": "post_to_linkedin",
                "chat_with_user": "chat_with_user",
            },
        )
        workflow.add_edge("invoke_tools", "call_tools_llm")
        workflow.add_edge("create_post", "post_to_linkedin")
        workflow.add_edge("post_to_linkedin", END)
        workflow.add_edge("chat_with_user", "call_tools_llm")
        memory = MemorySaver()
        self.workflow = workflow.compile(checkpointer=memory)
        print("Workflow built successfully")

    @staticmethod
    def determine_next_action(state: AgentState):
        print("\nDetermining next action...")
        last_message = state.messages[-1]
        print(f"Last message type: {type(last_message)}")

        if hasattr(last_message, "tool_calls") and last_message.tool_calls:
            print("Next action: more_tools")
            return "more_tools"
        elif state.content_items and not state.generated_posts:
            print("Next action: create_post")
            return "create_post"
        elif state.generated_posts:
            print("Next action: post_to_linkedin")
            return "post_to_linkedin"
        else:
            print("Next action: chat_with_user")
            return "chat_with_user"

    def call_tools_llm(self, state: AgentState):
        print("\nCalling tools LLM...")
        messages = state.messages
        system_message = SystemMessage(content=TOOLS_SYSTEM_PROMPT)
        messages = [system_message] + messages
        print(f"Number of messages being processed: {len(messages)}")
        ai_message = self.tool_calling_model.invoke(messages)
        print("AI message: ", ai_message)
        return {"messages": [ai_message]}

    async def invoke_tools(self, state: AgentState):
        print("\nInvoking tools...")
        tool_messages = []
        tool_calls = state.messages[-1].tool_calls
        print(f"Number of tool calls: {len(tool_calls)}")

        for t in tool_calls:
            print(f"\nProcessing tool call: {t['name']}")
            if t["name"] not in self.tools:
                print(f"Warning: Invalid tool name - {t['name']}")
                result = "Invalid tool name."
            else:
                tool = self.tools[t["name"]]
                print(f"Invoking tool with args: {t['args']}")
                result = await tool.ainvoke(t["args"])
                print(f"Tool result type: {type(result)}")
                if isinstance(result, List):
                    print(f"Number of content items: {len(result)}")
                    state.content_items = result

                tool_messages.append(
                    ToolMessage(
                        content=str(result), tool_call_id=t["id"], name=t["name"]
                    )
                )

        return {"messages": tool_messages, "content_items": state.content_items}

    async def create_post(self, state: AgentState):
        print("\nCreating posts...")
        generated_posts = []
        examples = writer_examples
        if state.content_items:
            print(
                f"Number of content items to process: {len(state.content_items)}")
            for i, content_item in enumerate(state.content_items):
                print(f"\nProcessing content item {i+1}")
                final_prompt = prompt.format(
                    examples=examples, topic=content_item.content
                )
                messages = [
                    SystemMessage(
                        content="You are a LinkedIn post writer. Your task is to write a post based on the given content. Do not make tool calls."
                    ),
                    HumanMessage(content=final_prompt),
                ]

                try:
                    response = await self.model.ainvoke(messages)

                    if not response or not response.content:
                        print("Warning: Empty response received")
                        continue

                    print("Saving post to CSV...")
                    save_post_to_csv(
                        prompt,
                        examples,
                        content_item.content,
                        response.content,
                        final_prompt,
                    )
                    generated_posts.append(response.content)
                except Exception as e:
                    print(f"Error during model invocation: {str(e)}")
                    continue
            state.generated_posts = generated_posts
            print(f"Generated {len(generated_posts)} posts")
        return {"generated_posts": generated_posts}

    async def should_post_to_linkedin(self, post: str) -> bool:
        print("\nChecking if post should be published...")
        user_input = input(
            f"Do you want to post this content to LinkedIn?\n\n{post}\n\nEnter 'yes' to post or 'no' to skip: "
        )
        print(f"User input: {user_input}")

        print("Analyzing user response...")
        analysis = await self.model.with_structured_output(
            LinkedInPostDecision
        ).ainvoke(
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

    async def chat_with_user(self, state: AgentState):
        print("\nChatting with user...")
        user_input = input(state.messages[-1].content)
        print(f"User input: {user_input}")
        print("Generating response...")
        response = await self.model.ainvoke([HumanMessage(content=user_input)])
        return {"messages": [response]}

    async def post_to_linkedin(self, state: AgentState):
        print("\nPosting to LinkedIn...")
        posts = state.generated_posts
        if not posts:
            print("No posts to publish")
            return

        print("Initializing browser...")
        playwright, browser, page = await initialize_browser(headless=False)
        try:
            print("Logging into LinkedIn...")
            await login_to_linkedin(page)
            feed_page = FeedPage(page)
            print(f"Processing {len(posts)} posts...")
            for i, post in enumerate(posts):
                print(f"\nProcessing post {i+1}")
                if await self.should_post_to_linkedin(post):
                    print("Posting to LinkedIn...")
                    await feed_page.create_post(post)
                else:
                    print("Skipping this post.")
        finally:
            print("Closing browser...")
            await close_browser(playwright, browser)
        return {
            "messages": [
                AIMessage(
                    content="Post created on LinkedIn. Do you want to create another post from any other source?"
                )
            ]
        }


print("Creating Agent instance...")
workflow = Agent().workflow
