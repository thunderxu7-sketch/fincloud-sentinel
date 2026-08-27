#!/usr/bin/env sh
set -eu
API_URL="${API_URL:-http://localhost:4000}"
AI_URL="${AI_URL:-http://localhost:8000}"
WEB_URL="${WEB_URL:-http://localhost:3000}"
PROMETHEUS_URL="${PROMETHEUS_URL:-http://localhost:9090}"
GRAFANA_URL="${GRAFANA_URL:-http://localhost:3001}"
key="smoke-$(date +%s)"
payload="{\"idempotencyKey\":\"$key\",\"accountId\":\"smoke-user\",\"kind\":\"WITHDRAWAL\",\"asset\":\"USDT\",\"amount\":\"10.25\",\"address\":\"TFinCloudSyntheticAddress\"}"
curl -fsS "$WEB_URL/" >/dev/null
curl -fsS "$API_URL/readyz" | grep -q '"status":"ready"'
first="$(curl -fsS -H 'content-type: application/json' -d "$payload" "$API_URL/api/v1/transactions")"
second="$(curl -fsS -H 'content-type: application/json' -d "$payload" "$API_URL/api/v1/transactions")"
printf '%s' "$first" | grep -q '"replayed":false'
printf '%s' "$second" | grep -q '"replayed":true'
curl -fsS "$API_URL/metrics" | grep -q fincloud_transactions_total
curl -fsS "$AI_URL/readyz" | grep -q '"status":"ready"'
curl -fsS "$PROMETHEUS_URL/-/ready" >/dev/null
curl -fsS "$GRAFANA_URL/api/health" | grep -q '"database"'
printf 'FinCloud Sentinel smoke test passed.\n'
