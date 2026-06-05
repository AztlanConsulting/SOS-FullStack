import http from 'k6/http';
import { check, group, sleep } from 'k6';

export function publicScenario(BASE_URL) {
  group('health', () => {
    const res = http.get(`${BASE_URL}/health`);
    check(res, { 'health 200': (r) => r.status === 200 });
  });
  sleep(0.5);

  group('plans', () => {
    const res = http.get(`${BASE_URL}/plans/getPlans`);
    check(res, {
      'plans 200': (r) => r.status === 200,
      'plans is array': (r) => Array.isArray(r.json()),
    });
  });
  sleep(0.5);

  group('pricing', () => {
    const res = http.get(`${BASE_URL}/pricing`);
    check(res, { 'pricing 200': (r) => r.status === 200 });
  });
  sleep(0.5);

  group('blog', () => {
    const res = http.get(`${BASE_URL}/blog?page=0`);
    check(res, { 'blog 200': (r) => r.status === 200 });
  });
  sleep(0.5);

  group('manuals', () => {
    const res = http.get(`${BASE_URL}/manuals/getManuals?page=0&searchTerm=&sortOption=Nombre+(A-Z)`);
    check(res, { 'manuals 200': (r) => r.status === 200 });
  });
  sleep(1);
}
