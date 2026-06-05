import http from 'k6/http';
import { check, group, sleep } from 'k6';

// Performs a full login → me → refresh → logout cycle.
// Only safe to call from smoke tests (1 VU, low iteration count).
// Do NOT use in load/stress — login is rate-limited to 5 req/15min per IP.
export function authFlowScenario(BASE_URL) {
  let accessToken = null;

  group('auth/login', () => {
    const res = http.post(
      `${BASE_URL}/auth/login`,
      JSON.stringify({
        email: __ENV.TEST_EMAIL,
        password: __ENV.TEST_PASSWORD,
        remember: true,
      }),
      { headers: { 'Content-Type': 'application/json' } },
    );
    check(res, {
      'login 200': (r) => r.status === 200,
      'login has accessToken': (r) => !!r.json('accessToken'),
      'login sets cookie': (r) => !!r.headers['Set-Cookie'],
    });
    if (res.status === 200) accessToken = res.json('accessToken');
  });
  sleep(0.3);

  if (!accessToken) return;

  group('auth/me', () => {
    const res = http.get(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    check(res, {
      'me 200': (r) => r.status === 200,
      'me has email': (r) => !!r.json('user').email,
    });
  });
  sleep(0.3);

  group('auth/refresh', () => {
    // Refresh token is in the HTTP-only cookie tracked automatically by k6
    const res = http.post(`${BASE_URL}/auth/refresh`);
    check(res, {
      'refresh 200': (r) => r.status === 200,
      'refresh has accessToken': (r) => !!r.json('accessToken'),
    });
    if (res.status === 200) accessToken = res.json('accessToken');
  });
  sleep(0.3);

  group('auth/logout', () => {
    const res = http.post(
      `${BASE_URL}/auth/logout`,
      null,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
    check(res, { 'logout 200': (r) => r.status === 200 });
  });
  sleep(0.5);
}
