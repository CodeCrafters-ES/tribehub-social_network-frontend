import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './',
});

const config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['./jest.setup.js'],
  testEnvironmentOptions: {
    url: 'http://localhost',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  // Ensure NEXT_PUBLIC_API_BASE_URL is always an absolute URL in tests so
  // axios's isURLSameOrigin helper (which calls `new URL(...)`) does not throw.
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
};

export default createJestConfig(config);
