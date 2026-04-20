import dotenv from 'dotenv';

dotenv.config();

/**
 * Retrieves and validates a required environment variable.
 * Throws an error if the variable is missing or empty.
 *
 * @param name - The name of the environment variable to retrieve
 * @return The validated environment variable value as a string
 */
function getEnv(name: string): string {
  const value = process.env[name];

  if (value == null || value.trim() === '') {
    throw new Error(`Missing required env variable: ${name}`);
  }

  return value;
}

export const config = {
  port: parseInt(process.env.PORT ?? '3000', 10),

  jwtAccessSecret: getEnv('JWT_ACCESS_SECRET'),
  jwtRefreshSecret: getEnv('JWT_REFRESH_SECRET'),

  jwtAccessExpiration: process.env.JWT_ACCESS_EXPIRATION ?? '15m',
  jwtRefreshExpiration: process.env.JWT_REFRESH_EXPIRATION ?? '7d',

  bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS ?? '12', 10),
} as const;
