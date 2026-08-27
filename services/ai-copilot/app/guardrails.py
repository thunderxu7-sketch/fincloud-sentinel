import re

from .models import ProposedAction


PROMPT_INJECTION_PATTERNS = (
    r"ignore (all|any|the) previous",
    r"reveal (the )?(system|developer) prompt",
    r"disable (the )?(guardrail|policy)",
    r"绕过.*(安全|规则|限制)",
)

SECRET_PATTERNS = (
    re.compile(r"(?i)(api[_-]?key|token|password)\s*[=:]\s*[^\s,;]+"),
    re.compile(r"\b(?:AKID|LTAI)[A-Z0-9]{12,}\b"),
)

ALLOWED_READ_TOOLS = frozenset(
    {"query_transaction", "query_metrics", "query_redacted_logs", "search_runbooks"}
)


def contains_prompt_injection(value: str) -> bool:
    lowered = value.lower()
    return any(re.search(pattern, lowered) for pattern in PROMPT_INJECTION_PATTERNS)


def redact_secrets(value: str) -> str:
    redacted = value
    for pattern in SECRET_PATTERNS:
        redacted = pattern.sub("[REDACTED]", redacted)
    return redacted


def enforce_action_policy(action: ProposedAction) -> ProposedAction:
    if action.tool in ALLOWED_READ_TOOLS and action.risk == "READ_ONLY":
        return action.model_copy(update={"approval_required": False})
    return action.model_copy(update={"approval_required": True})
