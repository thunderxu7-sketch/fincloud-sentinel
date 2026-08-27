FROM python:3.11-slim AS runtime
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
RUN useradd --create-home --shell /usr/sbin/nologin fincloud
WORKDIR /app
COPY services/ai-copilot/pyproject.toml ./
COPY services/ai-copilot/app ./app
COPY services/ai-copilot/knowledge ./knowledge
RUN pip install --no-cache-dir .
USER fincloud
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--proxy-headers"]
