from typing import Literal

from pydantic import BaseModel, Field


class Incident(BaseModel):
    id: str
    title: str
    severity: Literal["SEV-1", "SEV-2", "SEV-3"]
    symptom: str
    metrics: dict[str, float] = Field(default_factory=dict)
    log_excerpt: list[str] = Field(default_factory=list, alias="logExcerpt")
    transaction_id: str | None = Field(default=None, alias="transactionId")

    model_config = {"populate_by_name": True}


class InvestigationRequest(BaseModel):
    incident: Incident
    question: str = "Diagnose this incident and propose safe next steps."
    locale: Literal["en", "zh-CN"] = "en"


class Evidence(BaseModel):
    source: str
    excerpt: str
    score: float


class ProposedAction(BaseModel):
    tool: str
    description: str
    risk: Literal["READ_ONLY", "MUTATING", "FINANCIAL"]
    approval_required: bool = Field(alias="approvalRequired")

    model_config = {"populate_by_name": True}


class InvestigationResponse(BaseModel):
    incident_id: str = Field(alias="incidentId")
    diagnosis: str
    confidence: float
    evidence: list[Evidence]
    proposed_actions: list[ProposedAction] = Field(alias="proposedActions")
    guardrail_notes: list[str] = Field(alias="guardrailNotes")
    model_provider: str = Field(default="deterministic", alias="modelProvider")

    model_config = {"populate_by_name": True}
