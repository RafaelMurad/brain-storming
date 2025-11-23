/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/*.test.ts'],
  transform: { '^.+\\.tsx?$': 'ts-jest' },
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts', '!src/scripts/**', '!src/index.ts'],
  coverageDirectory: 'coverage',
  testTimeout: 30000,
  verbose: true,
};
