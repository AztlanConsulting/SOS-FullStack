process.env.JWT_ACCESS_SECRET = 'test-secret';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
process.env.PAYPAL_CLIENT_ID = 'test-client-id';
process.env.PAYPAL_CLIENT_SECRET = 'test-client-secret';
process.env.PAYPAL_REDIRECT_BASE_URL = 'https://test.com';

// Increase Jest timeout for integration tests that may perform DB setup/teardown
// Default 5s can be too short for in-memory MongoDB startup on some machines.
// Set to 2 minutes to be safe on slower Windows machines.
// eslint-disable-next-line no-undef
jest.setTimeout(120000);
