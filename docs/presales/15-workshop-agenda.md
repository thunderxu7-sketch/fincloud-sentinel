# Customer solution workshop agenda and action log

## Participants

Business sponsor, transaction/ledger owner, risk/model owner, architecture/platform, SRE, security,
privacy/legal/compliance, data/integration, finance/procurement, Alibaba Cloud SA and delivery lead.

## 120-minute workshop

| Time | Topic | Output |
|---:|---|---|
| 0–10 | Outcome, urgency and decision date | agreed problem statement and sponsor |
| 10–30 | Transaction/ledger/reconciliation journey | current-state flow and failure baseline |
| 30–45 | Workload, dependencies and data | volume profile, integrations, classification/region |
| 45–60 | Risk/model/AI policy | decisions, errors, fallback, tool and data boundaries |
| 60–75 | Reliability/security/compliance | SLO, RPO/RTO, threats, approvals and blockers |
| 75–90 | Target architecture options | responsibilities, products, alternatives and assumptions |
| 90–105 | POC and evidence | scope, critical gates, environment, owners and budget |
| 105–115 | TCO/commercial/operating model | cost inputs, procurement, support and handover |
| 115–120 | Decisions and next steps | go/no-go, action owners/dates and next meeting |

## Facilitation principles

- Begin with business effect and measurable baseline, not cloud products.
- Draw the critical transaction and failure path live; mark authority and trust boundaries.
- Separate facts, assumptions, constraints, risks and decisions using different labels.
- Ask “how will we prove it?” for every capability or performance claim.
- Park non-decision detail; never hide unresolved security, data or commercial blockers.

## Decision log

| ID | Decision / assumption / risk | Type | Evidence | Owner | Due | Status |
|---|---|---|---|---|---|---|
| D-001 | Example: one target region for POC; production DR separate | Decision | sponsor confirmation | customer architect | YYYY-MM-DD | Open |

## Action log

| Action | Deliverable | Owner | Contributors | Due | Blocker |
|---|---|---|---|---|---|
| Confirm peak TPS and event amplification | workload sheet/export | transaction owner | SRE/data | YYYY-MM-DD | — |
| Confirm data/model region restrictions | signed data-flow note | privacy/legal | security/AI | YYYY-MM-DD | model vendor terms |
| Finalize POC critical gates | scorecard v1 | business owner | all | YYYY-MM-DD | baseline metrics |

## Workshop readout

Send within one business day: confirmed outcome, current/target diagrams, known/unknown requirements,
assumption/risk/decision logs, product hypotheses, POC go/no-go, action owners/dates and the next
meeting's required decision. Participants correct factual errors before architecture is baselined.
