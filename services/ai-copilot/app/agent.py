from pathlib import Path

from .guardrails import contains_prompt_injection, enforce_action_policy, redact_secrets
from .models import (
    Evidence,
    InvestigationRequest,
    InvestigationResponse,
    ProposedAction,
)
from .retrieval import RunbookRetriever


DIAGNOSES = {
    "reconciliation_mismatch_total": (
        "The external settlement and internal double-entry ledger disagree. "
        "Treat this as a funds-safety incident: pause the affected settlement path, "
        "preserve evidence, and reconcile by immutable transaction identifier."
    ),
    "rpc_error_rate": (
        "The confirmation backlog is most consistent with upstream RPC instability. "
        "The secondary endpoint should be verified before any replay is attempted."
    ),
    "duplicate_event_total": (
        "The message broker redelivered events, while the inbox/idempotency control prevented "
        "duplicate ledger posting. The system is degraded but the financial invariant is intact."
    ),
    "model_timeout_rate": (
        "Risk-model latency exceeded its budget and opened the circuit breaker. "
        "Deterministic rules are serving as the fail-closed fallback."
    ),
}


class IncidentCopilot:
    def __init__(self, knowledge_dir: Path):
        self._retriever = RunbookRetriever(knowledge_dir)

    def investigate(self, request: InvestigationRequest) -> InvestigationResponse:
        incident = request.incident
        notes = ["All evidence is read-only and secrets are redacted before analysis."]
        if contains_prompt_injection(request.question):
            notes.append("Prompt-injection content was detected and ignored.")

        metric_key = next((key for key in DIAGNOSES if incident.metrics.get(key, 0) > 0), None)
        diagnosis = DIAGNOSES.get(
            metric_key or "",
            "The available evidence is insufficient for a single root cause. Keep the service "
            "in a safe state and collect transaction, metric, and trace evidence.",
        )
        query = " ".join(
            [incident.title, incident.symptom, *incident.metrics.keys(), *incident.log_excerpt]
        )
        retrieved = self._retriever.search(redact_secrets(query))
        evidence = [
            Evidence(source=item.source, excerpt=redact_secrets(item.excerpt), score=item.score)
            for item in retrieved
        ]

        actions = [
            enforce_action_policy(
                ProposedAction(
                    tool="query_transaction",
                    description="Confirm the current state and optimistic-lock version.",
                    risk="READ_ONLY",
                    approvalRequired=False,
                )
            ),
            enforce_action_policy(
                ProposedAction(
                    tool="query_redacted_logs",
                    description="Correlate redacted logs using the incident and transaction IDs.",
                    risk="READ_ONLY",
                    approvalRequired=False,
                )
            ),
        ]

        if incident.severity == "SEV-1":
            actions.append(
                enforce_action_policy(
                    ProposedAction(
                        tool="pause_settlement_route",
                        description="Pause new settlements for the affected asset after approval.",
                        risk="FINANCIAL",
                        approvalRequired=True,
                    )
                )
            )
            notes.append("Financially consequential actions require explicit human approval.")

        return InvestigationResponse(
            incidentId=incident.id,
            diagnosis=diagnosis,
            confidence=0.92 if metric_key else 0.55,
            evidence=evidence,
            proposedActions=actions,
            guardrailNotes=notes,
        )
