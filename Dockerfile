# Multi-stage Dockerfile for Astronaut Health Monitor
# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Runtime Backend & Static Serving
FROM python:3.11-slim
WORKDIR /app

RUN pip install --no-cache-dir fastapi uvicorn pydantic

COPY backend /app/backend
COPY ml /app/ml
COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist

ENV APP_HOST=0.0.0.0
ENV APP_PORT=8000

EXPOSE 8000

CMD ["python", "-m", "uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000"]

