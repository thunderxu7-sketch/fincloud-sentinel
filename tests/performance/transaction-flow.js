import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  scenarios: {
    steady: { executor: 'constant-arrival-rate', rate: 30, timeUnit: '1s', duration: '45s', preAllocatedVUs: 20, maxVUs: 80 },
  },
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<250'],
    checks: ['rate>0.99'],
  },
};

const baseUrl = __ENV.CORE_API_URL || 'http://localhost:4000';

export default function () {
  const idempotencyKey = `k6-${__VU}-${__ITER}`;
  const payload = JSON.stringify({
    idempotencyKey,
    accountId: `acct-${__VU}`,
    kind: 'WITHDRAWAL',
    asset: 'USDT',
    amount: '25.50',
    address: 'TFinCloudSyntheticAddress',
    country: 'SG',
    newAddress: false,
    recentTransactionCount: 1,
  });
  const params = { headers: { 'Content-Type': 'application/json', 'x-request-id': idempotencyKey } };
  const created = http.post(`${baseUrl}/api/v1/transactions`, payload, params);
  check(created, { 'created': (response) => response.status === 201, 'has transaction': (response) => Boolean(response.json('transaction.id')) });
  const replayed = http.post(`${baseUrl}/api/v1/transactions`, payload, params);
  check(replayed, { 'idempotent replay': (response) => response.status === 200 && response.json('replayed') === true });
  sleep(0.1);
}
