FROM node:20-slim AS frontend
WORKDIR /app/ui

ARG OPENAI_API_KEY
ENV OPENAI_API_KEY=${OPENAI_API_KEY}

# Copy package files and install dependencies
COPY ui/package.json ui/pnpm-lock.yaml ./
RUN npm install -g pnpm@9.14.4 && \
    pnpm install --frozen-lockfile

# Copy the entire ui directory
COPY ui/ ./

# Build the frontend
RUN pnpm run build && \
    mkdir -p /app/ui/public

FROM python:3.11.10-slim AS backend
WORKDIR /app

# Install system dependencies and Node.js
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    build-essential \
    netcat-traditional \
    net-tools \
    wget \
    gnupg \
    libgconf-2-4 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libpango-1.0-0 \
    libcairo2 \
    libasound2 \
    libnspr4 \
    libnss3 \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Install poetry
RUN pip install poetry

# Copy backend files and install dependencies
COPY agent/pyproject.toml pyproject.toml
COPY agent/poetry.lock poetry.lock
COPY agent/Readme.md README.md
COPY agent/backend backend/ 

# Configure poetry and install dependencies
RUN poetry config virtualenvs.create false \
    && poetry install --no-interaction --no-ansi

# Install Playwright and its dependencies after poetry install
RUN playwright install chromium \
    && playwright install-deps chromium

# Copy frontend build from the previous stage
COPY --from=frontend /app/ui/.next /app/ui/.next
COPY --from=frontend /app/ui/public /app/ui/public
COPY --from=frontend /app/ui/app /app/ui/app

ARG BACKEND_PORT=8000
ARG FRONTEND_PORT=3000
ENV BACKEND_PORT=${BACKEND_PORT}
ENV FRONTEND_PORT=${FRONTEND_PORT}

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:${FRONTEND_PORT}/api/health && curl -f http://localhost:${BACKEND_PORT}/health || exit 1

EXPOSE ${BACKEND_PORT} ${FRONTEND_PORT}

# Install supervisor
RUN apt-get update && apt-get install -y supervisor

# Install pnpm in the backend stage
RUN npm install -g pnpm@9.14.4

# Add supervisor configuration
COPY <<EOF /etc/supervisor/conf.d/supervisord.conf
[supervisord]
nodaemon=true
user=root
logfile=/var/log/supervisord.log
loglevel=debug

[program:frontend]
directory=/app/ui
command=bash -c "pnpm install && pnpm start"
autostart=true
autorestart=true
stderr_logfile=/var/log/frontend.err.log
stdout_logfile=/var/log/frontend.out.log
environment=NODE_ENV="production",PORT="${FRONTEND_PORT}",LOG_LEVEL="info"
stopasgroup=true
killasgroup=true
startsecs=10
startretries=3

[program:backend]
directory=/app
command=uvicorn backend.app:app --host 0.0.0.0 --port ${BACKEND_PORT} --reload --log-level info --access-log
autostart=true
autorestart=true
stderr_logfile=/var/log/backend.err.log
stdout_logfile=/var/log/backend.out.log
stopasgroup=true
killasgroup=true
EOF

# Ensure the log directory exists and has proper permissions
RUN mkdir -p /var/log && chmod 777 /var/log

# Copy package files for frontend
COPY --from=frontend /app/ui/package.json /app/ui/
COPY --from=frontend /app/ui/pnpm-lock.yaml /app/ui/

# Add development supervisor configuration
COPY supervisor.dev.conf /etc/supervisor/conf.d/supervisord.dev.conf

# Modify the CMD to accept an argument for choosing the config
ENTRYPOINT ["/usr/bin/supervisord"]
CMD ["-c", "/etc/supervisor/conf.d/supervisord.conf"]

