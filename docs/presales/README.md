# Presales evidence pack / 售前证据包

This pack is designed for a financial-technology customer conversation from first discovery through
POC decision and production handoff. Replace bracketed assumptions with customer-validated facts;
never present demo targets as measured production results.

| # | Asset | Decision it supports |
|---|---|---|
| 00 | [Executive proposal / 中英双语高层方案](00-executive-proposal.md) | Why act, why this approach, what decision is needed |
| 01 | [Discovery questionnaire](01-discovery-questionnaire.md) | Is there a qualified problem and buying path? |
| 02 | [Requirements and NFR matrix](02-requirements-and-nfr.md) | What is in/out and how good must it be? |
| 03 | [Alibaba Cloud product selection](03-product-selection.md) | Why each managed service is justified |
| 04 | [Implementation roadmap](04-implementation-roadmap.md) | Who delivers what and when? |
| 05 | [POC plan and scorecard](05-poc-plan-and-scorecard.md) | What evidence constitutes success? |
| 06 | [Security threat model](06-security-threat-model.md) | Which threats and controls must be closed? |
| 07 | [DR and business continuity](07-dr-bcp-plan.md) | How is service restored safely? |
| 08 | [TCO and ROI model](08-tco-roi-model.md) | Is the economic case credible? |
| 09 | [Alibaba/AWS/Azure comparison](09-cloud-comparison.md) | How should alternatives be evaluated fairly? |
| 10 | [RFP technical response](10-rfp-response.md) | Is every claim evidenced and qualified? |
| 11 | [Deployment and handover](11-deployment-handover.md) | Can the design become an operated service? |
| 12 | [20-minute demo script](12-demo-script.md) | Can the team prove the important controls live? |
| 13 | [Two-page solution brief](13-solution-brief.md) | Can a sponsor understand the value quickly? |
| 14 | [Compliance responsibility matrix](14-compliance-responsibility.md) | Who owns each control and artifact? |
| 15 | [Workshop agenda and action log](15-workshop-agenda.md) | How is discovery converted into decisions? |
| — | `FinCloud-Sentinel-TCO-Model.xlsx` | Editable assumptions, costs, ROI and sensitivity |
| — | `FinCloud-Sentinel-Executive-Deck.pptx` | Customer-ready executive/technical presentation |

## Qualification gate

Proceed to a POC only when all are true:

- a named business owner accepts a measurable problem and baseline;
- data class, target region, regulated scope, integration owners, and decision date are known;
- the POC can use synthetic or properly authorized masked data;
- success metrics, failure conditions, budget range, and next-step decision are signed off;
- the POC is not being used to bypass security, procurement, or model governance.

## Evidence hierarchy

1. Reproducible test or customer workload result.
2. Service configuration and telemetry tied to the test.
3. Official product documentation and contractual terms.
4. Architecture reasoning with explicit assumptions.
5. Marketing statement—never sufficient on its own.
