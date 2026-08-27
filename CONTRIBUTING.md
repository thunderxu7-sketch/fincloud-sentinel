# Contributing

FinCloud Sentinel welcomes focused changes that strengthen demonstrable transaction integrity,
AI safety, reliability, or solution documentation.

1. Create a branch and keep synthetic data only.
2. Use Conventional Commits, for example `fix(ledger): reject unbalanced settlement entries`.
3. Add or update tests for every behavior change.
4. Run `npm run check` and `uv run --project services/ai-copilot --extra dev pytest -q`.
5. Do not add secrets, customer names, unverified benchmark claims, or production wallet addresses.
6. Explain financial-control and security impact in the pull request.

A change touching money parsing, state transitions, ledger posting, reconciliation, authorization,
or action policies requires two reviewers in a real production fork.
