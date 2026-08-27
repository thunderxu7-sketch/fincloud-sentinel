# TCO and ROI model

Use the accompanying `FinCloud-Sentinel-TCO-Model.xlsx`. It separates customer inputs, cloud costs,
people/operations, migration, risk-adjusted benefits, cash flow and sensitivity. Sample values are
illustrative and **not an Alibaba Cloud quote**.

## Required inputs

| Category | Driver | Unit |
|---|---|---|
| Workload | average/peak TPS, event amplification, payload, retention, egress | requests, GB, months |
| Compute | ACK node baseline/burst, model CPU/GPU hours, environment count | instance-hours |
| Data | OceanBase capacity/IO, Hologres compute/storage, Tair memory | service-specific |
| Messaging | normal vs ordered/transactional TPS and retention | TPS/message GB |
| Observability | metric series, log/trace ingestion, retention/query | GB/day, series |
| Delivery | engineering, security, data, SRE and enablement effort | person-days |
| Operations | on-call, patching, incidents, audit evidence, support | FTE/year |
| Benefits | avoided incidents/loss, reduced MTTR/toil, release acceleration | probability × impact |

## Formulas

```text
Annual cloud run-rate = Σ(quantity × unit price × utilization/commitment factor)
Three-year TCO = implementation + migration + Σ(yearly cloud + operations + support) + exit reserve
Risk-adjusted avoided loss = incidents/year × average impact × expected reduction × confidence
Productivity benefit = hours saved/year × loaded hourly cost × adoption realization
Net benefit = avoided loss + productivity + growth contribution - incremental operating cost
ROI = (total benefits - TCO) / TCO
Payback month = first month cumulative discounted cash flow becomes non-negative
NPV = Σ(net cash flow_t / (1 + discount rate)^(t/12))
```

## Cost controls

- POC account, budget cap, daily alerts, tags, expiry and automatic teardown.
- Separate baseline and burst; use autoscaling only after cold-start and capacity tests.
- Sample telemetry, redact early, tier retention; ingesting everything is not observability strategy.
- Size advanced RocketMQ message types using current edition multipliers.
- Reserve/subscribe stable capacity only after usage evidence; keep uncertain burst pay-as-you-go.
- Track unit economics: cost per 1,000 completed transactions and per investigated incident.

## Sensitivity cases

| Case | Load | Retention | Model capacity | Benefit confidence |
|---|---:|---:|---:|---:|
| Downside | 0.7× base | 2× base | dedicated peak | 50% |
| Base | discovered forecast | policy | measured baseline + burst | 70% |
| Upside | 1.5× base | optimized tiers | committed baseline + elastic | 85% |

A business case is rejected or redesigned when ROI depends on unsupported “zero incident” claims,
ignores customer labor/migration/exit, uses list prices from another region, or hides model and
observability consumption.

## Commercial validation checklist

1. Export prices/quote with region, currency, tax, edition and date.
2. Reconcile calculator quantities to architecture and measured POC metrics.
3. Confirm discounts, support, data transfer, backup/DR and non-production environments.
4. Review with FinOps, procurement and workload owners.
5. Record uncertainty ranges and refresh at design freeze and 30/90 days after launch.
