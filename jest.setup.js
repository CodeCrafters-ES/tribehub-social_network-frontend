import '@testing-library/jest-dom';

// Provide an absolute base URL so axios's isURLSameOrigin helper (which calls
// new URL(baseURL)) does not throw in the jsdom test environment.
process.env.NEXT_PUBLIC_API_BASE_URL = 'http://localhost:3000/api/v1';
