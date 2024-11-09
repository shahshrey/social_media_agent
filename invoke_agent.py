import asyncio
from backend.agent import workflow, AgentState
from uuid import uuid4
from langchain_core.messages import HumanMessage

async def main():
    result = None
    config = {"configurable": {"thread_id": uuid4()}}
    default = AgentState()
    default.messages.append(
        HumanMessage(content="Create a post from reddit, just focus on the topic discussed.")
    )
    
    try:
        while True:
            result = await workflow.ainvoke(input=result if result else default, config=config)
            next_input = input(result["messages"][-1].content)
            result["messages"].append(HumanMessage(content=next_input))
    except KeyboardInterrupt:
        print("\nExiting...")

if __name__ == "__main__":
    asyncio.run(main())