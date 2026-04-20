import rateLimit from 'express-rate-limit';

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
});
