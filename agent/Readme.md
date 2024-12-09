# LinkedIn Content Generation & Automation System

An AI-powered system for generating and automating LinkedIn posts from multiple content sources, including YouTube, Reddit, Towards Data Science, and LinkedIn profiles.

## Features

- Multi-source content generation:
  - Transcribes YouTube videos
  - Summarizes Reddit posts
  - Processes Towards Data Science articles
  - Analyzes LinkedIn profiles
  - Transcribes audio content
- Automates LinkedIn posting with Playwright
- Optimizes content through AI models (OpenAI/Anthropic)
- Orchestrates workflows using LangGraph
- Modern UI with Next.js, Tailwind CSS, and Shadcn UI

## Technical Architecture

Built on a modular architecture using:
- **LangGraph** for orchestrating workflows
- **Playwright** for LinkedIn automation
- **LangChain** with OpenAI/Anthropic for content generation
- **Beautiful Soup** for web scraping

## Prerequisites

- Python 3.11+
- Chrome/Chromium browser
- Valid API keys:
  - OpenAI or Anthropic API
  - Reddit API (PRAW)
  - LinkedIn credentials

## Installation

1. **Clone and setup backend:**
   ```bash
   git clone <repository-url>
   cd agent
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
poetry install
   playwright install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   Required environment variables:
   ```plaintext
   OPENAI_API_KEY=your_key_here
   ANTHROPIC_API_KEY=your_key_here
   PRAW_CLIENT_ID=your_reddit_client_id
   PRAW_CLIENT_SECRET=your_reddit_client_secret
   PRAW_USER_AGENT=your_user_agent
   LINKEDIN_EMAIL=your_email
   LINKEDIN_PASSWORD=your_password
   ```

## Development

1. **Start the backend:**
   ```bash
   # From the agent directory
   python -m uvicorn main:app --reload
   ```

2. **Start the frontend:**
   ```bash
   # From the ui directory
   pnpm run dev
   ```


## Project Structure

```plaintext
├── agent/                  # Backend
│   ├── backend/
│   │   ├── agent.py       # Main workflow orchestration
│   │   ├── automation/    # LinkedIn automation
│   │   ├── models/        # AI configurations
│   │   ├── prompts/       # Prompt templates
│   │   ├── schema/        # Data models
│   │   └── utils/         # Helper functions
│   └── langgraph.json     # Workflow configuration
│
└── ui/                     # Frontend
    ├── app/
    │   ├── components/    # React components
    │   ├── hooks/         # Custom hooks
    │   └── lib/           # Utilities & constants
    └── public/            # Static assets
```

## API Documentation

The backend exposes the following endpoints:

- `POST /api/generate` - Generate content from sources
- `POST /api/post` - Post content to LinkedIn
- `GET /api/status` - Check agent status

See the API documentation at `/docs` when running the backend.

## Error Handling

The system implements comprehensive error handling:
- LinkedIn automation retries
- API rate limiting protection
- Graceful fallbacks for content generation
- Detailed error logging

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to your branch
5. Open a Pull Request

Please ensure:
- Tests pass
- TypeScript types are properly defined
- Components use Tailwind CSS
- New features are documented

## License

MIT License - See LICENSE file for details
