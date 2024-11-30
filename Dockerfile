FROM node:20-slim AS frontend
WORKDIR /app/ui
COPY ui/package.json ui/pnpm-lock.yaml ./
RUN npm install -g pnpm@9.12.3 && pnpm install
COPY ui .
RUN pnpm build

FROM python:3.11.10-slim AS backend
WORKDIR /app

# Install system dependencies and Node.js
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    build-essential \
    netcat-traditional \
    net-tools \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Install poetry
RUN pip install poetry

# Copy ALL backend files first, then install
COPY agent/pyproject.toml pyproject.toml
COPY agent/poetry.lock poetry.lock
COPY agent/Readme.md README.md
COPY agent/backend backend/ 

# Configure poetry and install dependencies
RUN poetry config virtualenvs.create false \
    && poetry install --no-interaction --no-ansi

# Copy frontend build from previous stage
COPY --from=frontend /app/ui/.next /app/ui/.next
COPY --from=frontend /app/ui/public /app/ui/public
COPY --from=frontend /app/ui/app/globals.css /app/ui/globals.css

ARG PORT=8002
ENV PORT=${PORT}
ENV FRONTEND_PORT=3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:${FRONTEND_PORT}/api/health && curl -f http://localhost:${PORT}/health || exit 1

EXPOSE ${PORT} ${FRONTEND_PORT}

CMD ["uvicorn", "backend.app:app", "--host", "0.0.0.0", "--port", "8002", "--reload", "--log-level", "info", "--access-log"]

