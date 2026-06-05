import { STAGES, THRESHOLDS } from '../config/options.js';
import { acquireTokens, getAuthHeaders } from '../helpers/auth.js';
import { publicScenario } from '../scenarios/public.js';
import { authFlowScenario } from '../scenarios/auth-flow.js';
import { dashboardScenario } from '../scenarios/dashboard.js';

export const options = {
  stages: STAGES.smoke,
  thresholds: THRESHOLDS.smoke,
};

export function setup() {
  const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
  return { tokens: acquireTokens(1), BASE_URL };
}

export default function (data) {
  const { BASE_URL, tokens } = data;
  const authHeaders = getAuthHeaders(tokens);

  publicScenario(BASE_URL);
  // auth-flow runs the full login cycle once — only safe at 1 VU
  authFlowScenario(BASE_URL);
  dashboardScenario(BASE_URL, authHeaders);
}
