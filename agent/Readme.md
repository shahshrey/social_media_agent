
# LinkedIn Content Generation & Automation System

An AI-powered system for generating and automating LinkedIn posts from multiple content sources, including YouTube, Reddit, Towards Data Science, and LinkedIn profiles.

## Features

- Multi-source content generation:
  - Transcribes YouTube videos
  - Summarizes Reddit posts
  - Processes Towards Data Science articles
  - Analyzes LinkedIn profiles
  - Transcribes audio content
- Automates LinkedIn posting
- Optimizes content through AI models
- Orchestrates workflows for smooth content processing

## Technical Architecture

Built on a modular architecture using:
- **LangGraph** for orchestrating workflows
- **Playwright** for LinkedIn automation
- **LangChain** with OpenAI or Anthropic for content generation
- **Beautiful Soup** for web scraping

## Prerequisites

- Python 3.11+
- Chrome/Chromium browser
- Valid API keys:
  - OpenAI or Anthropic API
  - Reddit API (PRAW)
  - LinkedIn credentials

## Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. **Set up a virtual environment:**
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Install Playwright browsers:**
   ```bash
   playwright install
   ```

5. **Configure environment variables:**
   Create a `.env` file with the following structure:
   ```plaintext
   OPENAI_API_KEY=your_key_here
   PRAW_CLIENT_ID=your_reddit_client_id
   PRAW_CLIENT_SECRET=your_reddit_client_secret
   PRAW_USER_AGENT=your_user_agent
   ```

## Usage

1. **Start Jupyter Notebook:**
   ```bash
   jupyter notebook
   ```

2. **Run the workflow in `invoke_agent.ipynb`:**
   - Select content sources
   - Generate and review content
   - Post content to LinkedIn

## Contributing

To contribute:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to your branch
5. Open a Pull Request

## Code Structure

```plaintext
backend/
├── agent.py          # Main workflow orchestration
├── automation/       # LinkedIn automation scripts
├── models/           # AI model configurations
├── prompts/          # AI prompt templates
├── schema/           # Data models
└── utils/            # Helper functions
```

## Important Notes

- Keep LinkedIn credentials secure
- Review content before posting
- Be mindful of API rate limits
- Adhere to LinkedIn’s automation policies

## License

[Include license details here]
