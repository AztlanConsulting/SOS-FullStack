import rateLimit from 'express-rate-limit';
import type { Request } from 'express';

/**
 * Get whitelisted IPs from environment variable for testing purposes.
 * RATE_LIMITER_WHITELIST should be a comma-separated list of IPs.
 *
 * This is used to exclude testing infrastructure IPs from rate limiting during:
 * - Load testing: High volume request testing
 * - Stress testing: System limit testing
 * - Smoke testing: Basic functionality verification
 *
 * Example: RATE_LIMITER_WHITELIST=10.0.0.1,192.168.1.100
 */
const getWhitelistedIPs = (): string[] => {
  const whitelist = process.env.RATE_LIMITER_WHITELIST || '';
  return whitelist
    .split(',')
    .map((ip) => ip.trim())
    .filter((ip) => ip.length > 0);
};

/**
 * Skip rate limiting for whitelisted IPs (testing infrastructure).
 * Allows load testing tools and CI/CD pipelines to bypass rate limits.
 */
const skipIfWhitelisted = (req: Request): boolean => {
  const whitelistedIPs = getWhitelistedIPs();
  const clientIP = req.ip || req.socket.remoteAddress || '';

  // Check if the client IP is in the whitelist (testing servers)
  return whitelistedIPs.includes(clientIP);
};

/**
 * Rate limiter for login endpoint.
 * Prevents brute-force attacks by limiting failed attempts per IP.
 */
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    error: 'RATE_LIMITED',
    message: 'Demasiados intentos. Intenta de nuevo en 15 minutos.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipIfWhitelisted,
});

/**
 * Rate limiter for password reset requests.
 * Keeps the public recovery endpoint from being abused by repeated submissions.
 */
export const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    error: 'RATE_LIMITED',
    message: 'Demasiadas solicitudes. Intenta de nuevo en 15 minutos.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipIfWhitelisted,
});
