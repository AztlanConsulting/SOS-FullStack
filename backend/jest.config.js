/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest',
  testMatch: ['**/*.test.ts'],
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  forceExit: true, // Helps ensure Jest doesn't hang after closing the DB connection

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@db/(.*)$': '<rootDir>/src/infrastructure/database/$1',
    '^@repo/(.*)$': '<rootDir>/src/infrastructure/repository/$1',
    '^@domain/(.*)$': '<rootDir>/src/domain/$1',
    '^@infrastructure/(.*)$': '<rootDir>/src/infrastructure/$1',
    '^@interfaces/(.*)$': '<rootDir>/src/interfaces/$1',
    '^@validation/(.*)$': '<rootDir>/src/types/$1',
    '^@use-cases/(.*)$': '<rootDir>/src/use-cases/$1',
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@vectorDB$':
      '<rootDir>/src/infrastructure/database/vectorDB/vectorDatabase.ts',
  },
};
