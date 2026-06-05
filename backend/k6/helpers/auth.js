import http from 'k6/http';
import { check } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

// Called once in setup() — acquires `count` tokens sequentially.
// The login endpoint is rate-limited to 5 requests per 15 min per IP.
// All VUs share localhost so this is the only safe way to get tokens.
export function acquireTokens(count = 1) {
  const tokens = [];
  for (let i = 0; i < count; i++) {

    http.post("", )

    const res = http.post(
      `${BASE_URL}/auth/login`,
      JSON.stringify({
        email: __ENV.TEST_EMAIL,
        password: __ENV.TEST_PASSWORD,
        remember: true,
      }),
      { headers: { 'Content-Type': 'application/json' } },
    );
    check(res, { [`login ${i + 1} ok`]: (r) => r.status === 200 });
    if (res.status === 200) {
      tokens.push(res.json('accessToken'));
    }
  }
  return tokens;
}

// Returns Authorization header for the current VU (round-robin from pool).
export function getAuthHeaders(tokens) {
  const token = tokens[(__VU - 1) % tokens.length];
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

// Rotates the access token using the refresh token cookie (tracked per VU).
// Call this if a request returns 401 mid-scenario (token expired after 15 min).
export function refreshToken() {
  const res = http.post(`${BASE_URL}/auth/refresh`);
  check(res, { 'token refreshed': (r) => r.status === 200 });
  return res.status === 200 ? res.json('accessToken') : null;
}
