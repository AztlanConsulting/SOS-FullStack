import { describe, it, expect, beforeEach } from 'vitest';
import { setAccessToken, getAccessToken } from '@shared/utils/tokenStorage';

describe('token storage (integration)', () => {
  beforeEach(() => {
    // Reset global token state between tests to ensure isolation
    setAccessToken(null);
  });

  it('persists token in shared runtime state', () => {
    // Store token in memory
    setAccessToken('abc');

    // Verify token was persisted correctly
    expect(getAccessToken()).toBe('abc');
  });

  it('overwrites existing token in same runtime session', () => {
    // Set initial token
    setAccessToken('first');

    // Overwrite token with new value
    setAccessToken('second');

    // Verify latest value is returned
    expect(getAccessToken()).toBe('second');
  });

  it('clears token when explicitly set to null', () => {
    // Explicitly clear stored token
    setAccessToken(null);

    // Verify token is removed from memory
    expect(getAccessToken()).toBeNull();
  });

  it('starts with clean state per test run', () => {
    // Ensure no token exists at test start
    expect(getAccessToken()).toBeNull();
  });
});
