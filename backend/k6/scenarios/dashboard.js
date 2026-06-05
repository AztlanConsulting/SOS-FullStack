import http from 'k6/http';
import { check, group, sleep } from 'k6';

// Metrics routes currently have no authMiddleware in the route file,
// so they are called without an Authorization header.
export function dashboardScenario(BASE_URL, authHeaders) {
  group('auth/me', () => {
    const res = http.get(`${BASE_URL}/auth/me`, { headers: authHeaders });
    check(res, { 'me 200': (r) => r.status === 200 });
  });
  sleep(0.3);

  group('clientDashboard', () => {
    const res = http.get(`${BASE_URL}/clientDashboard`, { headers: authHeaders });
    check(res, { 'clientDashboard 200': (r) => r.status === 200 });
  });
  sleep(0.3);

  group('metrics/plan-distribution', () => {
    const res = http.get(`${BASE_URL}/metrics/plan-distribution`);
    check(res, { 'plan-distribution 200': (r) => r.status === 200 });
  });
  sleep(0.3);

  group('metrics/clients-by-country', () => {
    const res = http.get(`${BASE_URL}/metrics/clients-by-country`);
    check(res, { 'clients-by-country 200': (r) => r.status === 200 });
  });
  sleep(0.3);

  group('metrics/visits', () => {
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    const res = http.get(`${BASE_URL}/metrics/visits?year=${year}&month=${month}`);
    check(res, { 'visits 200': (r) => r.status === 200 });
  });
  sleep(0.3);

  group('members-only', () => {
    const res = http.get(`${BASE_URL}/members-only?page=0`, { headers: authHeaders });
    check(res, { 'members-only 200': (r) => r.status === 200 });
  });
  sleep(1);
}
