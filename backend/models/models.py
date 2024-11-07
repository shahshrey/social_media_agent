from typing import Literal
from openai import OpenAI
from langchain_anthropic import ChatAnthropic
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_core.language_models import BaseChatModel

ModelProvider = Literal["openai", "anthropic"]

MODEL_CONFIGS = {
    "openai": {
        "class": ChatOpenAI,
        "model": "gpt-4o-2024-08-06",
    },
    "anthropic": {
        "class": ChatAnthropic,
        "model": "claude-3-5-sonnet-20240620",
    },
}

def get_model(provider: ModelProvider = "openai", streaming: bool = True) -> BaseChatModel:
    """
    Factory function to create and return a chat model based on the specified provider.

    Args:
        provider (ModelProvider): The model provider to use. Defaults to "openai".
        streaming (bool): Whether to enable streaming for the model. Defaults to True.

    Returns:
        BaseChatModel: An instance of the specified chat model.

    Raises:
        ValueError: If an unsupported provider is specified.
    """
    if provider not in MODEL_CONFIGS:
        raise ValueError(f"Unsupported provider: {provider}")

    config = MODEL_CONFIGS[provider]
    return config["class"](
        model=config["model"],
        temperature=0,
        streaming=streaming
    )

# TODO: model can come from an env var or some other config
model = get_model("openai")
nonstreaming_model = get_model("openai", streaming=False)
openai_client = OpenAI()
embeddings = OpenAIEmbeddings(model="text-embedding-3-large")

# Configuration for tool binding
tool_bind_kwargs = {
    "tool_choice": "auto",
    "parallel_tool_calls": False
}
