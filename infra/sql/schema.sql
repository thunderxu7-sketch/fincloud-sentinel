-- PostgreSQL reference schema. Production mappings may use OceanBase PostgreSQL mode.
CREATE TABLE transactions (
  id UUID PRIMARY KEY,
  idempotency_key VARCHAR(128) NOT NULL UNIQUE,
  account_id VARCHAR(128) NOT NULL,
  kind VARCHAR(16) NOT NULL CHECK (kind IN ('DEPOSIT', 'WITHDRAWAL')),
  asset VARCHAR(32) NOT NULL,
  amount_atomic NUMERIC(78, 0) NOT NULL CHECK (amount_atomic > 0),
  destination VARCHAR(256) NOT NULL,
  status VARCHAR(32) NOT NULL,
  risk_score INTEGER NOT NULL CHECK (risk_score BETWEEN 0 AND 100),
  version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE ledger_entries (
  id UUID PRIMARY KEY,
  transaction_id UUID NOT NULL REFERENCES transactions(id),
  account VARCHAR(128) NOT NULL,
  side VARCHAR(8) NOT NULL CHECK (side IN ('DEBIT', 'CREDIT')),
  asset VARCHAR(32) NOT NULL,
  amount_atomic NUMERIC(78, 0) NOT NULL CHECK (amount_atomic > 0),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (transaction_id, account, side)
);

CREATE TABLE outbox_events (
  id UUID PRIMARY KEY,
  aggregate_id UUID NOT NULL REFERENCES transactions(id),
  event_type VARCHAR(96) NOT NULL,
  payload JSONB NOT NULL,
  occurred_at TIMESTAMPTZ NOT NULL,
  published_at TIMESTAMPTZ,
  retry_count INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX outbox_unpublished_idx ON outbox_events (occurred_at) WHERE published_at IS NULL;

CREATE TABLE inbox_receipts (
  consumer_name VARCHAR(96) NOT NULL,
  event_id UUID NOT NULL,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (consumer_name, event_id)
);

CREATE TABLE reconciliation_runs (
  id UUID PRIMARY KEY,
  checked_at TIMESTAMPTZ NOT NULL,
  transaction_count INTEGER NOT NULL,
  matched_count INTEGER NOT NULL,
  issues JSONB NOT NULL
);

-- Invariant query: every completed transaction must have equal debit and credit totals.
CREATE VIEW ledger_balance_check AS
SELECT transaction_id, asset,
  SUM(CASE WHEN side = 'DEBIT' THEN amount_atomic ELSE 0 END) AS debits,
  SUM(CASE WHEN side = 'CREDIT' THEN amount_atomic ELSE 0 END) AS credits
FROM ledger_entries
GROUP BY transaction_id, asset;
