# Customer discovery questionnaire / 客户需求访谈

Record an owner, evidence source, confidence, and follow-up for every answer. “Unknown” is valid;
an invented answer is not.

## A. Business outcome and urgency

1. Which transaction journey is in scope: deposit, withdrawal, transfer, payment, settlement, refund?
2. What measurable loss, delay, complaint, manual workload, or audit finding exists today?
3. What is the 30/90/365-day target, and what happens if nothing changes?
4. Which executive owns the outcome and which team owns the service after launch?
5. What event sets the decision date: license, market launch, renewal, incident, audit, migration?
6. Is the primary value risk reduction, growth, latency, developer velocity, cost, or compliance?

## B. Workload and transaction semantics

1. Average/peak TPS and 10-minute burst; deposit/withdrawal ratio; expected annual growth.
2. Assets/currencies/rails, decimal precision, minimum/maximum amount, confirmation/finality policy.
3. Current business identifiers, retry behavior, timeout, duplicate rate, and manual repair path.
4. State model and allowed transitions; which states are customer-visible?
5. Ledger model, source of truth, booking time, hold/reserve semantics, correction procedure.
6. Reconciliation frequency, data sources, matching keys, tolerance, aging and escalation.
7. External provider rate limits, SLAs, signing/custody boundaries, webhook/reorg behavior.

## C. Risk, model, and AI

1. Existing rules/models, feature freshness, model owner, approval and validation process.
2. Latency/error/false-positive/false-negative baselines and business cost of each error.
3. Required fail-open/fail-closed behavior for each transaction class.
4. Explainability, reason code, adverse-action, fairness, drift and retraining obligations.
5. Which evidence can an AI assistant read? Which data must never reach a model?
6. Which tools may it call read-only? Which actions require one/two approvals or are prohibited?
7. Approved model providers/regions, retention, training-use restrictions and exit requirements.

## D. Security, privacy, and compliance

1. Data classification: PII, payment data, credentials, secrets, transaction and model data.
2. Legal entities, licenses, regulators, standards, audit cadence, evidence retention and legal hold.
3. Required region and cross-border constraints; encryption/key ownership and rotation.
4. Identity providers, privileged access, segregation of duties and break-glass process.
5. Threat history: account takeover, API abuse, insider risk, supply chain, DDoS, data exfiltration.
6. Pen-test, SAST/DAST/SCA, SBOM, vulnerability SLA and third-party assurance requirements.
7. Incident notification, forensic preservation and regulator/customer communication obligations.

## E. Reliability and operations

1. Business-hours and 24×7 availability SLO; peak blackout periods.
2. RPO/RTO by capability—not one blanket value.
3. Current topology, single points, dependency SLAs, quotas and capacity headroom.
4. Metrics/logs/traces stack, on-call ownership, incident severity and error-budget policy.
5. Deployment frequency, rollback time, change approval, canary and maintenance windows.
6. Backup scope, immutability, restore-test frequency and last successful evidence.
7. Regional disaster declaration authority and safe failback procedure.

## F. Platform, integration, migration, and commercials

1. Current cloud/on-prem network, landing zone, account/RAM model and IaC standard.
2. APIs, events, database/change data capture, batch files, identity and observability integrations.
3. Migration pattern: new journey, strangler, dual-write, shadow-read, bulk migration, cutover.
4. Portability/exit requirements, open-source policy and acceptable managed-service lock-in.
5. Procurement route, security/vendor review, budget type, contract/SLA/support requirements.
6. Internal skill gaps, partner needs, enablement and documentation language.
7. Who signs POC success and who funds production?

## Qualification output

```text
Problem statement:
Measured baseline:
Target outcome/date:
Economic buyer / champion / operators:
Scope / exclusions:
Decision criteria and process:
Security/compliance blockers:
Required integrations/data:
Budget range / commercial route:
POC go/no-go and next meeting:
```
