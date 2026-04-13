/** @type {import('jest').Config} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@db/(.*)$': '<rootDir>/src/infrastructure/database/$1',
    '^@repo/(.*)$': '<rootDir>/src/infrastructure/repository/$1',
    '^@domain/(.*)$': '<rootDir>/src/domain/$1',
    '^@infrastructure/(.*)$': '<rootDir>/src/infrastructure/$1',
    '^@interfaces/(.*)$': '<rootDir>/src/interfaces/$1',
    '^@types/(.*)$': '<rootDir>/src/types/$1',
    '^@use-cases/(.*)$': '<rootDir>/src/use-cases/$1',
    '^@vectorDB$':
      '<rootDir>/src/infrastructure/database/vectorDB/vectorDatabase.ts',
  },
};
