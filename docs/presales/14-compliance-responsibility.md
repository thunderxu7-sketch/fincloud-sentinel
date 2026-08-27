# Compliance and shared-responsibility matrix

This is an architecture workshop aid, not legal advice or a certification statement. The customer
must map applicable jurisdictions, licenses, regulators and control frameworks with counsel/auditors.

| Control domain | Cloud provider responsibility | Customer responsibility | Shared/delivery evidence |
|---|---|---|---|
| Physical facilities/infrastructure | facilities and managed-service infrastructure per contract | assess provider and required regions | assurance reports and service terms |
| Cloud account/governance | platform controls and APIs | landing zone, account separation, policies, inventory | IaC and configuration review |
| Identity/access | RAM/KMS/RRSA capabilities | role design, MFA, joiner/mover/leaver, reviews, break glass | access matrix and ActionTrail evidence |
| Data classification/privacy | regional services/security features | lawful basis, minimization, residency, retention/deletion, subject rights | data flow/DPIA and test evidence |
| Encryption/keys | encryption/KMS service operation | key ownership, policy, rotation, backup/revocation ceremony | KMS configuration and rotation drill |
| Application/financial integrity | managed runtime/database features | code, state/ledger rules, reconciliation, limits and approvals | invariant tests and audit trail |
| Network/API security | GA/WAF/ALB/Anti-DDoS capabilities | topology, policies, origin restriction, API identity/rate limits | diagrams and DAST/load evidence |
| Vulnerability/supply chain | provider platform patching | application/dependency/image/IaC scanning and remediation | SBOM, scan results, provenance |
| Logging/monitoring | SLS/ARMS/Prometheus services | signal design, redaction, alert/on-call, retention and legal hold | dashboard, rules, incident record |
| Backup/DR | product replication/backup capabilities | RPO/RTO, backup policy, restore and failover decisions/tests | restore/game-day report |
| AI/model risk | provider model/service controls per terms | use case, data policy, validation, explainability, drift, fallback and approval | model card, eval and tool policy |
| Incident/regulatory reporting | provider incident support/notification per contract | response, forensics, customer/regulator notice | response plan and communication log |
| Third parties/integrations | cloud service dependencies | settlement/model/data processors and contract risk | vendor inventory and exit plan |
| Business continuity | service SLAs/features | end-to-end process, people, provider diversification and drills | BCP and exercised RACI |

## Evidence checklist

- Applicable-control matrix with owner, system boundary, frequency and evidence location.
- Data inventory/flow, classification, region, retention, deletion and subprocessor record.
- Cloud assurance reports and contractual commitments relevant to selected services/regions.
- Access review, KMS rotation, vulnerability, penetration, backup/restore and incident evidence.
- Model/use-case approval, training/retention terms, evaluation, human oversight and change history.
- Exceptions have risk, compensating control, accountable approver and expiration date.
