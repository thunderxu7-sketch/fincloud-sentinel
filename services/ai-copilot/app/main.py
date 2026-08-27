from pathlib import Path
from time import perf_counter

from fastapi import FastAPI, Request, Response
from prometheus_client import CONTENT_TYPE_LATEST, Counter, Histogram, generate_latest

from .agent import IncidentCopilot
from .models import InvestigationRequest, InvestigationResponse


app = FastAPI(
    title="FinCloud Sentinel AI Copilot",
    version="0.1.0",
    description="Evidence-grounded incident diagnosis with human approval for mutating actions.",
)
copilot = IncidentCopilot(Path(__file__).resolve().parent.parent / "knowledge")
REQUESTS = Counter(
    "fincloud_copilot_requests_total",
    "Copilot requests by route and response status.",
    ["route", "status"],
)
LATENCY = Histogram(
    "fincloud_copilot_request_duration_seconds",
    "Copilot request latency by route.",
    ["route"],
    buckets=(0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2, 5),
)


@app.middleware("http")
async def observe_requests(request: Request, call_next):
    route = request.url.path
    started = perf_counter()
    response = await call_next(request)
    if route != "/metrics":
        REQUESTS.labels(route=route, status=str(response.status_code)).inc()
        LATENCY.labels(route=route).observe(perf_counter() - started)
    return response


@app.get("/healthz")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "fincloud-ai-copilot"}


@app.get("/readyz")
def readiness() -> dict[str, str]:
    return {"status": "ready", "knowledge": "loaded"}


@app.get("/metrics")
def metrics() -> Response:
    return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)


@app.post("/api/v1/investigate", response_model=InvestigationResponse)
def investigate(request: InvestigationRequest) -> InvestigationResponse:
    return copilot.investigate(request)
