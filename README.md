# Social Media Agent

A full-stack application for automated social media content generation and management, leveraging LangGraph, Copilotkit, and modern web technologies.

### Product Overview

The Social Media Agent is an AI-powered platform that automates content generation and management for LinkedIn, using sophisticated AI agents to process multiple content sources and maintain consistent brand voice.

### Target Users

- Content Managers
- Social Media Managers
- Digital Marketing Teams
- Business Professionals
- Content Creators

### Core Functionality

#### 1. Writing Examples Management
- Store and manage writing examples
- Live preview with formatting
- Style customization for AI tone matching

#### 2. Content Source Processing
- **YouTube Integration**
    - Transcribe video content
    - Extract key points and insights
    - Generate summaries with timestamps
- **Reddit Processing**
    - Monitor specific subreddits
    - Extract trending discussions
    - Analyze engagement patterns
- **LinkedIn Profile Analysis**
    - Extract professional insights
    - Identify content patterns
    - Analyze engagement metrics
- **Additional Sources**
    - Towards Data Science articles
    - Audio content transcription
    - Custom text inputs

#### 3. Content Generation & Publishing
- **AI Writing Assistant**
    - Professional tone matching
    - Context-aware responses
    - Style adaptation from examples
- **Post Management**
    - Direct LinkedIn posting
    - Post preview and editing
    - Quick actions for common tasks
- **User Interface**
    - Responsive dashboard
    - Dark mode support
    - Mobile-first design

### Application Flow

#### 1. Content Creation Flow

```
[Writing Examples] → [Content Sources] → [AI Processing] → [Review] → [LinkedIn Publishing]
       ↑                    ↑                   ↑             ↑              ↑
Style Storage         Source Ingestion    Tone Matching    Preview      Direct Posting
Formatting           Data Extraction     Style Application  Editing     Error Handling
Live Preview         Preprocessing       Context Awareness Interface    Confirmation
```

#### 2. Technical Flow

1. **Content Ingestion**
   - User submits content source (URL/text)
   - System identifies content type
   - Content is preprocessed based on type

2. **Processing Pipeline**
   - Content extraction and cleaning
   - Metadata analysis
   - Key point identification

3. **AI Enhancement**
   - Style matching using LangGraph
   - Tone adjustment
   - Engagement optimization
   - Hashtag generation

4. **Review Process**
   - Content preview in UI
   - Editing capabilities
   - A/B testing options

5. **Publishing**
   - Automated LinkedIn posting via Playwright
   - Scheduling management (Coming soon)

## Tech Stack

### Frontend

- Next.js 14 with App Router
- TypeScript (strict mode)
- Tailwind CSS with mobile-first design
- Shadcn UI + Radix UI primitives
- Server Components with Suspense
- Copilotkit for state management

### Backend

- Python 3.11+
- FastAPI
- LangGraph for workflow orchestration
- Playwright for LinkedIn automation
- Poetry for dependency management
- Beautiful Soup for web scraping

### Infrastructure

- Docker & Docker Compose
- Supervisor for process management
- GitHub Actions for CI/CD

## Prerequisites

- Docker and Docker Compose
- Node.js 18+
- Python 3.11+
- pnpm 9.14.4+
- Chrome/Chromium browser (for LinkedIn automation)
- Valid LinkedIn credentials
- OpenAI API key for AI functionality

## Environment Variables

Create a `.env` file in the root directory:

```plaintext
# Frontend
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
FRONTEND_PORT=3000
FRONTEND_URL=http://localhost:3000

# Backend
BACKEND_PORT=8000
BACKEND_URL=http://localhost:8000
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_key_here
PRAW_CLIENT_ID=your_reddit_client_id
PRAW_CLIENT_SECRET=your_reddit_client_secret
PRAW_USER_AGENT=your_user_agent
LINKEDIN_EMAIL=your_email
LINKEDIN_PASSWORD=your_password
```

## Development Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd social_media_agent
   ```

2. **Install dependencies:**
   ```bash
   # Frontend dependencies
   cd ui
   pnpm install

   # Backend dependencies
   cd ../agent
   poetry install
   playwright install
   ```

3. **Start development environment:**
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build
   ```

   This will start:
   - Frontend at http://localhost:3000
   - Backend at http://localhost:8000
   - Hot reloading enabled for both services

## Production Deployment

1. **Build and start containers:**

   ```bash
    docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
   ```
2. **Monitor logs:**

   ```bash
   docker compose logs -f
   ```

## Project Structure

```plaintext
├── agent/                 # Backend service
│   ├── backend/          # Python backend code
│   │   ├── agent.py      # Main AI orchestration
│   │   ├── automation/   # LinkedIn automation
│   │   ├── examples/     # Writing examples management
│   │   ├── prompts/      # Prompt templates
│   │   ├── schema/       # Data models
│   │   └── utils/        # Helper functions
│   ├── pyproject.toml    # Python dependencies
│   └── poetry.lock       # Locked dependencies
├── ui/                   # Frontend service
│   ├── app/             # Next.js app directory
│   │   ├── components/  # Shared UI components
│   │   ├── hooks/       # Custom React hooks
│   │   ├── providers/   # Context providers
│   │   └── lib/         # Utilities and constants
│   ├── components/      # Global components
│   │   ├── ui/         # Shadcn UI components
│   │   └── layouts/    # Layout components
│   ├── lib/            # Shared utilities
│   └── public/         # Static assets
├── docker-compose.yml    # Production compose
├── docker-compose.dev.yml# Development compose
├── Dockerfile           # Multi-stage build
└── README.md            # This file
```

## Resource Management

The application is configured with the following resource limits:

### Production
- CPU: 1.5 cores (min: 0.5)
- Memory: 2GB (min: 1GB)

### Development
- CPU: 2 cores
- Memory: 4GB

## Health Checks

The application includes built-in health checks:
- Frontend: `/api/health`
- Backend: `/health`
- 30-second intervals with 5 retries

## Error Handling

- Comprehensive error logging
- Automatic process restarts via Supervisor
- Docker health checks and restart policies
- Rate limiting protection