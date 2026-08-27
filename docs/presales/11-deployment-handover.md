# Deployment, go-live, and handover plan

## Environment model

| Environment | Data | Connectivity | Change control | Purpose |
|---|---|---|---|---|
| Local/CI | generated synthetic | internet-limited | pull request | unit/eval/static checks |
| POC | synthetic/approved masked | isolated VPC/private services | POC owner | measure scorecard |
| Staging | production-like masked | production topology | release approval | integration/load/restore/canary |
| Production | classified customer data | private, least privilege | segregation + protected environment | operated service |
| Recovery | encrypted replicated/restore | isolated until validation | incident commander | DR rehearsal/failover |

Accounts/projects, credentials, keys, data and telemetry do not cross environments implicitly.

## CI/CD gates

1. Format/lint/type/schema validation.
2. Financial invariant, API, authorization and AI safety tests.
3. SAST/SCA/secret/IaC/container scan and SBOM/provenance.
4. Build immutable digest; sign and promote the same artifact.
5. Deploy to staging, smoke, integration, load/failure and migration checks.
6. Human approval for production protected environment.
7. Progressive delivery: internal → 1% → 10% → 50% → 100%, with SLO/correctness gates.
8. Automated rollback of application version; database change uses forward/compensating plan.

## Pre-go-live checklist

- [ ] Scope, architecture, data flow, threat model and residual risks approved.
- [ ] RAM/RRSA roles, two-person privileges, break glass and KMS ceremony tested.
- [ ] Capacity/quota at 1.5× expected peak and dependency limits confirmed.
- [ ] Reconciliation, limits, confirmation/finality and model fallback signed by business/risk.
- [ ] SLO dashboards, burn-rate alerts, on-call, escalation and provider tickets exercised.
- [ ] Backup restore, zone failure and regional recovery rehearsal passed.
- [ ] Rollback/feature flag/settlement pause tested with synthetic traffic.
- [ ] Security findings within SLA; SBOM/digest/provenance retained.
- [ ] Privacy/compliance/customer communication and change window approved.
- [ ] Cost alerts, ownership tags, support plan and decommission/exit path active.

## Handover package

| Package | Required evidence |
|---|---|
| Service ownership | owner, on-call, SLO/error budget, dependency and escalation map |
| Architecture | deployed topology, data flow, ADRs, ports/endpoints, versions |
| Access/security | role matrix, key rotation, break glass, audit and vulnerability process |
| Operations | dashboards, alert catalog, Runbooks, known failure modes and safe limits |
| Data | schemas, classification, backup/restore, retention/deletion and reconciliation |
| AI/model | model card, feature/runbook versions, eval, drift/fallback and approval policy |
| Delivery | repositories, pipeline, artifact registry, release/rollback and change calendar |
| Economics | budget, tags, unit-cost dashboard, commitment and renewal dates |
| Training | recorded walkthrough, operator game day and competency sign-off |

## Acceptance

Handover is complete only when a customer operator, without delivery-team intervention, can deploy a
safe release, investigate a synthetic incident, execute a rollback, restore data, reconcile in-flight
transactions, rotate a credential, and explain the escalation/approval path.
