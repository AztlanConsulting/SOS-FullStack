export const STAGES = {
  smoke: [{ duration: '30s', target: 1 }],
  load: [
    { duration: '30s', target: 5 },
    { duration: '2m', target: 20 },
    { duration: '30s', target: 0 },
  ],
};

export const THRESHOLDS = {
  smoke: {
    http_req_failed: [{ threshold: 'rate<3000', abortOnFail: true }],
    http_req_duration: [{ threshold: 'p(95)<800', abortOnFail: true }],
  },
  load: {
    http_req_failed: ['rate<3000'],
    'http_req_duration{scenario:public}': ['p(95)<3000'],
    'http_req_duration{scenario:auth_flow}': ['p(95)<3000'],
    'http_req_duration{scenario:dashboard}': ['p(95)<3000'],
    'http_req_duration{scenario:lost_pet}': ['p(95)<3000'],
  },
  stress: {
    http_req_failed: ['rate<3000'],
    http_req_duration: ['p(95)<3000'],
  },
};
