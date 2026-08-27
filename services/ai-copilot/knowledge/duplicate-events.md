# Duplicate event runbook

At-least-once delivery can produce duplicate messages. Every consumer must persist an inbox key
before applying a side effect, and ledger posting must use the immutable transaction identifier.

If duplicate delivery rises but `ledger_post_duplicate_total` remains zero, the financial invariant
is protected. Investigate producer retries and broker acknowledgements, then drain the queue under
normal rate limits. Never disable idempotency to improve throughput.
