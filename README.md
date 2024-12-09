# Social Media Agent

A full-stack application for automated social media content generation and management, built with Next.js, Python, and Docker.

### Product Overview

The Social Media Agent is an AI-powered platform that automates content generation and management for social media platforms, with a primary focus on LinkedIn. It processes multiple content sources to create engaging, professional posts while maintaining brand voice and content strategy.

### Target Users

- Content Managers
- Social Media Managers
- Digital Marketing Teams
- Business Professionals
- Content Creators

### Core Functionality

#### 1. Content Source Processing

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

#### 2. Content Generation

- **AI Writing Styles**
    - Professional tone
    - Thought leadership
    - Educational content
    - Engagement-focused posts
- **Customization Options**
    - Brand voice adaptation
    - Industry-specific terminology

#### 3. Automation Features

- **Posting Schedule**
    - Time optimization
    - Queue management (Coming soon)
    - Content calendar (Coming soon)
- **Engagement Automation** (Coming soon)
    - Auto-responses
    - Comment management
    - Connection handling

### Application Flow

#### 1. Content Creation Flow

```
[Content Sources] → [Processing Pipeline] → [AI Enhancement] → [Review] → [Publishing]
   ↑                      ↑                      ↑              ↑           ↑
YouTube               Extraction            Style Application   UI        LinkedIn
Reddit                Transcription         Tone Matching    Approval    Automation
Articles              Summarization         SEO Optimization Interface    Scheduling
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

   - Automated LinkedIn posting
   - Scheduling management (Coming soon)

## Features

- AI-powered content generation and automation
- Multi-source content processing (YouTube, Reddit, LinkedIn, etc.)
- Modern UI with Next.js, Tailwind CSS, and Shadcn UI
- Containerized development and production environments
- Automated LinkedIn posting with Playwright
- Workflow orchestration using LangGraph

## Tech Stack

### Frontend

- Next.js 14
- TypeScript
- Tailwind CSS
- Shadcn UI
- Radix UI

### Backend

- Python 3.11
- FastAPI
- LangGraph
- Playwright
- Poetry for dependency management

### Infrastructure

- Docker & Docker Compose
- Supervisor for process management
- GitHub Actions for CI/CD

## Prerequisites

- Docker and Docker Compose
- Node.js 20+
- Python 3.11+
- pnpm 9.14.4+

## Environment Variables

Create a `.env` file in the root directory:

```plaintext
FRONTEND_PORT=3000
BACKEND_PORT=8000
OPENAI_API_KEY=your_openai_key
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:8000
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
   docker-compose logs -f
   ```

## Project Structure

```
├── agent/                 # Backend service
│   ├── backend/          # Python backend code
│   ├── pyproject.toml    # Python dependencies
│   └── poetry.lock       # Locked dependencies
├── ui/                   # Frontend service
│   ├── app/             # Next.js application
│   ├── public/          # Static assets
│   └── package.json     # Node.js dependencies
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