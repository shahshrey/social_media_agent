from typing import List

from dotenv import load_dotenv
from langchain_core.messages import (
    HumanMessage,
    SystemMessage,
    ToolMessage,
)
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import END, StateGraph
from langchain_openai import ChatOpenAI
from backend.prompts.prompts import prompt, writer_examples, TOOLS_SYSTEM_PROMPT
from backend.utils.utils import save_post_to_csv
from backend.tools import (
    fetch_tds_articles,
    summarize_reddit,
    transcribe_audio,
    transcribe_youtube,
    fetch_linkedin_profile_posts,
)
from backend.schema.state import AgentState
from backend.schema.schema import ContentItem

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
        # workflow.add_node("chat_with_user", self.chat_with_user)
        workflow.set_entry_point("call_tools_llm")

        print("Adding workflow edges...")
        workflow.add_conditional_edges(
            "call_tools_llm",
            self.determine_next_action,
            {
                "invoke_tools": "invoke_tools",
                "create_post": "create_post",
                "END": END,
            },
        )
        workflow.add_edge("invoke_tools", "call_tools_llm")
        workflow.add_edge("create_post", END)
        # workflow.add_edge("chat_with_user", END)
        memory = MemorySaver()
        self.workflow = workflow.compile(checkpointer=memory)
        print("Workflow built successfully")

    @staticmethod
    def determine_next_action(state: AgentState):
        print("\nDetermining next action...")
        last_message = state.messages[-1]
        print(f"Last message type: {type(last_message)}")

        if hasattr(last_message, "tool_calls") and last_message.tool_calls:
            print("Next action: invoke_tools")
            return "invoke_tools"
        elif state.content_items and not state.generated_posts:
            print("Next action: create_post")
            return "create_post"
        else:
            print("Next action: END")
            return "END"

    def call_tools_llm(self, state: AgentState):
        print("\nCalling tools LLM...")
        messages = state.messages[-5:]
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
                    # Let the ContentItem model handle the validation and conversion
                    state.content_items = [ContentItem.parse_obj(item) for item in result]

                tool_messages.append(
                    ToolMessage(
                        content=str(result), tool_call_id=t["id"], name=t["name"]
                    )
                )

        return {"messages": tool_messages, "content_items": state.content_items}

    async def create_post(self, state: AgentState):
        print("\nCreating posts...")
        # Initialize new_posts list to store newly generated posts
        new_posts = []
        examples = state.writer_examples or writer_examples
        if state.content_items:
            print(f"Number of content items to process: {len(state.content_items)}")
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
                    new_posts.append(response.content)
                except Exception as e:
                    print(f"Error during model invocation: {str(e)}")
                    continue
            
            # Update state with new posts (either append or replace)
            if state.generated_posts:
                # Append new posts to existing ones
                state.generated_posts.extend(new_posts)
            else:
                # Set new posts if there weren't any before
                state.generated_posts = new_posts
            
            print(f"Generated {len(new_posts)} new posts. Total posts: {len(state.generated_posts)}")
        return {"generated_posts": state.generated_posts}

    async def chat_with_user(self, state: AgentState):
        print("\nChatting with user...")
        last_message = state.messages[-1].content
        print(f"Last message: {last_message}")
        
        response = await self.model.ainvoke([HumanMessage(content=last_message)])
        return {"messages": [response]}




print("Creating Agent instance...")
workflow = Agent().workflow
