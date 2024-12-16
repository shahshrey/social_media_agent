# LinkedIn Content Generation & Automation System (Frontend)

A Langgraph - Copilotkit-based frontend application for generating and automating LinkedIn posts, leveraging coAgents for state management and AI interactions.

## Features

- **AI-Powered Content Generation:**
  - Generate posts from multiple sources
  - Real-time content optimization
  - Style matching based on examples
  - LinkedIn profile analysis
- **Copilotkit Integration:**
  - Shared state management via coAgents
  - Real-time chat interface
  - Progress tracking and visualization
- **Modern UI Components:**
  - Responsive Shadcn/UI components
  - Tailwind CSS styling
  - Server Components with Suspense
  - Mobile-first design

## Technical Architecture

The application is built on a modern React stack with Copilotkit at its core:

### coAgents Architecture
- **State Management:**
  - Centralized state using Copilotkit's coAgents
  - Real-time synchronization between UI and AI
  - Persistent chat history and context
  - Progress tracking for AI operations

### Frontend Stack
- **Next.js 14** with App Router
  - Server Components
  - Client-side state management
  - API routes for backend communication
- **UI Components:**
  - Shadcn UI + Radix UI primitives
  - Tailwind CSS for styling
  - Responsive design system
- **TypeScript Integration:**
  - Strict type checking
  - Type-safe state management
  - Shared types between components

## Prerequisites

- Node.js 18+
- PNPM 9.14.4+
- Valid API keys configured in environment

## Installation

1. **Clone and setup:**
   ```bash
   git clone <repository-url>
   cd ui
   pnpm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env.local
   ```
   Required variables:
   ```plaintext
   NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
   OPENAI_API_KEY=your_key_here
   ```

## Development

1. **Start development server:**
   ```bash
   pnpm run dev
   ```

2. **Build for production:**
   ```bash
   pnpm build
   pnpm start
   ```

## Project Structure

```plaintext
ui/                      # Frontend application root
├── app/                 # Next.js app directory
│   ├── components/      # Shared UI components
│   ├── hooks/          # Custom React hooks
│   │   └── useAgentState.ts  # coAgent state management
│   ├── providers/      # Context providers
│   ├── auth/           # Authentication components
│   ├── dashboard/      # Dashboard views
│   ├── types/          # TypeScript types
│   ├── lib/            # Utilities and constants
│   └── Main.tsx        # Root component with coAgent
├── components/         # Global components
│   ├── ui/            # Shadcn UI components
│   └── layouts/       # Layout components
├── lib/               # Shared utilities
│   ├── types/        # Global TypeScript types
│   └── theme/        # Theme configuration
└── public/           # Static assets
```

## Key Components

### coAgent Integration
- `Main.tsx`: Root component integrating coAgent system
- `useAgentState.ts`: Custom hook managing coAgent state:
  - Writer examples management
  - Generated posts handling
  - Content item updates
  - Real-time state synchronization

### UI Components
- `components/`: Reusable UI components using Shadcn UI
- `layouts/`: Page layout components
- `providers/`: Context providers for themes and state

## State Management

The application leverages Copilotkit's coAgents for sophisticated state management:
- **Shared State:**
  - Synchronized between UI and AI components
  - Real-time updates across components
  - Persistent chat history
- **Progress Tracking:**
  - AI operation status monitoring
  - Error handling and recovery
- **Content Management:**
  - Writer examples storage
  - Generated posts handling
  - Content source management
