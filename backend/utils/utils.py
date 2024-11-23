import json
import re
from typing import Any, Dict

import requests
from bs4 import BeautifulSoup
from pydantic import BaseModel
from langchain_core.messages import HumanMessage
from backend.models.models import model
from rich.console import Console
from rich.panel import Panel
from rich.syntax import Syntax
from backend.schema.schema import ContentItem
from backend.prompts.prompts import twitter_post_prompt
import os
import csv
from datetime import datetime
from pathlib import Path

def fetch_url_content(url):
    response = requests.get(url)
    if response.status_code != 200:
        print(f"Failed to retrieve page with status code {response.status_code}")
        return None
    return response.content


def parse_article_content(article_url):
    content = fetch_url_content(article_url)
    if not content:
        return None

    article_soup = BeautifulSoup(content, "html.parser")
    paragraphs = article_soup.find_all("p")
    full_content = "\n".join([p.get_text() for p in paragraphs])

    unwanted_strings = [
        "Sign up\nSign in\nSign up\nSign in\nMariya Mansurova\nFollow\nTowards Data Science\n--\nListen\nShare",
        """\n--\n--\nTowards Data Science\nData & Product Analytics Lead at Wise | ClickHouse Evangelist\nHelp\nStatus\nAbout\nCareers\nPress\nBlog\nPrivacy\nTerms\nText to speech\nTeams""",
    ]
    for unwanted in unwanted_strings:
        full_content = full_content.replace(unwanted, "")

    full_content = re.sub(r"[^\x00-\x7F]+", "", full_content)
    return full_content


def log_output(title: str, content: Any):
    console = Console()
    if isinstance(content, dict):
        content_str = json.dumps(content, indent=2)
    elif isinstance(content, BaseModel):
        content_str = json.dumps(content.dict(), indent=2)
    else:
        content_str = str(content)
    console.print(Panel(Syntax(content_str, "json", theme="monokai"), title=title))
    
    
def save_post_to_csv(
    prompt: str, examples: str, content_item: ContentItem, response_content: str, final_prompt: str
) -> None:
    filename: str = "posts.csv"
    file_exists: bool = os.path.isfile(filename)

    with open(filename, "a", newline="") as file:
        writer = csv.writer(file)
        if not file_exists:
            writer.writerow(["Prompt", "Examples", "Content", "Response", "Final prompt"])
        writer.writerow([prompt, examples, str(content_item), response_content, final_prompt])

    print(f"Post data {'appended to' if file_exists else 'written to'} file: {filename}")


def save_post_to_json(
    prompt: str, 
    examples: str, 
    content_item: ContentItem, 
    response_content: str, 
    final_prompt: str
) -> None:
    """
    Save post data to a JSON file with timestamp
    """
    filename: str = "posts.json"
    
    # Create new post entry
    new_post: Dict[str, Any] = {
        "timestamp": datetime.now().isoformat(),
        "prompt": prompt,
        "examples": examples,
        "content": str(content_item),
        "response": response_content,
        "final_prompt": final_prompt
    }
    
    # Load existing data or create new structure
    if Path(filename).exists():
        with open(filename, 'r', encoding='utf-8') as file:
            try:
                data = json.load(file)
                posts = data.get("posts", [])
            except json.JSONDecodeError:
                posts = []
    else:
        posts = []
    
    # Append new post
    posts.append(new_post)
    
    # Save updated data
    with open(filename, 'w', encoding='utf-8') as file:
        json.dump({"posts": posts}, file, indent=2, ensure_ascii=False)
    
    print(f"Post data saved to: {filename}")    

def validate_twitter_content(content: str) -> tuple[str, bool]:
    """
    Validates and formats content for Twitter
    Returns (formatted_content, is_valid)
    """
    # Remove leading/trailing whitespace
    content = content.strip()
    
    # Basic validation
    if not content:
        return "", False
        
    if len(content) > 280:
        summary_prompt = twitter_post_prompt.format(content=content)
        content = model.invoke([HumanMessage(content=summary_prompt)]).content
        # last check to ensure we don't exceed 280 characters
        if len(content) > 280:
            content = content[:277] + "..."
    
    # Remove duplicate whitespace
    content = ' '.join(content.split())
    
    # Check for common issues
    if content.lower() == "test":  # Twitter often blocks generic test tweets
        return "", False
        
    return content, True

