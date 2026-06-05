import { THRESHOLDS } from '../config/options.js';
import { acquireTokens, getAuthHeaders } from '../helpers/auth.js';
import { publicScenario } from '../scenarios/public.js';
import { dashboardScenario } from '../scenarios/dashboard.js';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export const options = {
  thresholds: THRESHOLDS.load,
  scenarios: {
    // VUs on public endpoints — mirrors anonymous visitor traffic
    public: {
      executor: 'ramping-vus',
      stages: [
        { duration: '1m', target: 420 },
        { duration: '3m', target: 764 },
        { duration: '1m', target: 0 },
      ],
      exec: 'runPublic',
      tags: { scenario: 'public' },
    },
    // VUs on authenticated dashboard — mirrors logged-in user traffic
    dashboard: {
      executor: 'ramping-vus',
      stages: [
        { duration: '1m', target: 380 },
        { duration: '3m', target: 573 },
        { duration: '1m', target: 0 },
      ],
      exec: 'runDashboard',
      tags: { scenario: 'dashboard' },
    },
  },
};

export function setup() {
  // One shared token is enough — authMiddleware always hits DB regardless
  return { tokens: acquireTokens(1) };
}

export function runPublic() {
  publicScenario(BASE_URL);
}

export function runDashboard(data) {
  dashboardScenario(BASE_URL, getAuthHeaders(data.tokens));
}
