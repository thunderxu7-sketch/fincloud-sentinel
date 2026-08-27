# Security policy

## Reporting

Do not open public issues for suspected vulnerabilities. Email `thunderxu7@gmail.com` with:
affected component, reproducible steps using synthetic data, impact, and suggested mitigation.
Do not include credentials or real customer/fund data.

The maintainer aims to acknowledge reports within 3 business days and provide an initial severity
assessment within 7 business days. This is a reference project, not a paid bug-bounty program.

## Supported versions

Only the current `main` branch is supported. Releases pin dependencies and publish checksums/SBOMs
through CI when enabled.

## Security boundaries

The public demo is static. It has no production API, identity store, wallet, signing key, model key,
or real transaction data. Local APIs bind to development ports and are not hardened internet
services. For production controls see the threat model, Helm chart, and deployment checklist.
