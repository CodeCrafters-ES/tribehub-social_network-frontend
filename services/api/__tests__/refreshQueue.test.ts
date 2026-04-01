/**
 * Tests for the thundering-herd prevention in the 401 → refresh → retry flow.
 *
 * Each test uses a fresh MockAdapter attached to the shared axiosInstance.
 * Because the interceptor module-level state (isRefreshing, pendingQueue)
 * persists across tests within a suite, each test must fully resolve all
 * pending requests before the next one starts — which is guaranteed by
 * awaiting Promise.allSettled().
 */

import MockAdapter from 'axios-mock-adapter';
import { axiosInstance } from '../axios';

// ---------------------------------------------------------------------------
// window.location mock — provide a realistic object so axios's isURLSameOrigin
// helper (which calls `new URL(platform.origin)`) does not throw at import time.
// ---------------------------------------------------------------------------

const originalDescriptor = Object.getOwnPropertyDescriptor(window, 'location');

beforeAll(() => {
  Object.defineProperty(window, 'location', {
    configurable: true,
    writable: true,
    value: {
      href: 'http://localhost/',
      origin: 'http://localhost',
      protocol: 'http:',
      host: 'localhost',
      hostname: 'localhost',
      port: '',
      pathname: '/',
      search: '',
      hash: '',
      assign: jest.fn(),
      replace: jest.fn(),
      reload: jest.fn(),
    },
  });
});

afterAll(() => {
  if (originalDescriptor) {
    Object.defineProperty(window, 'location', originalDescriptor);
  }
});

// Reset href between tests so we can assert on it
beforeEach(() => {
  (window.location as { href: string }).href = 'http://localhost/';
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('401 → refresh → retry (thundering herd prevention)', () => {
  it('makes exactly one refresh call when multiple requests receive 401 simultaneously', async () => {
    const mock = new MockAdapter(axiosInstance, { onNoMatch: 'throwException' });

    let refreshCallCount = 0;
    const callCounts: Record<string, number> = { '/protected/1': 0, '/protected/2': 0, '/protected/3': 0 };

    for (const path of ['/protected/1', '/protected/2', '/protected/3']) {
      const p = path;
      mock.onGet(p).reply(() => {
        callCounts[p]++;
        if (callCounts[p] === 1) return [401, { code: 'UNAUTHORIZED' }];
        return [200, { id: parseInt(p.slice(-1)) }];
      });
    }

    mock.onPost('/auth/refresh').reply(() => {
      refreshCallCount++;
      return [200, {}];
    });

    const [r1, r2, r3] = await Promise.all([
      axiosInstance.get('/protected/1'),
      axiosInstance.get('/protected/2'),
      axiosInstance.get('/protected/3'),
    ]);

    expect(refreshCallCount).toBe(1);
    expect(r1.data).toEqual({ id: 1 });
    expect(r2.data).toEqual({ id: 2 });
    expect(r3.data).toEqual({ id: 3 });

    mock.restore();
  });

  it('redirects to /login and rejects all pending requests when refresh fails', async () => {
    const mock = new MockAdapter(axiosInstance, { onNoMatch: 'throwException' });

    const callCounts: Record<string, number> = { '/secure/a': 0, '/secure/b': 0 };

    for (const path of ['/secure/a', '/secure/b']) {
      const p = path;
      mock.onGet(p).reply(() => {
        callCounts[p]++;
        // Always return 401 — refresh will fail so retries never happen
        return [401, { code: 'UNAUTHORIZED' }];
      });
    }

    mock.onPost('/auth/refresh').reply(401, { code: 'REFRESH_FAILED' });

    const results = await Promise.allSettled([
      axiosInstance.get('/secure/a'),
      axiosInstance.get('/secure/b'),
    ]);

    expect(results[0].status).toBe('rejected');
    expect(results[1].status).toBe('rejected');
    expect(window.location.href).toBe('/login');

    mock.restore();
  });

  it('does not retry the /auth/refresh endpoint itself on 401 (prevents infinite loop)', async () => {
    const mock = new MockAdapter(axiosInstance, { onNoMatch: 'throwException' });

    let refreshCallCount = 0;
    mock.onPost('/auth/refresh').reply(() => {
      refreshCallCount++;
      return [401, { code: 'UNAUTHORIZED' }];
    });

    await expect(axiosInstance.post('/auth/refresh')).rejects.toMatchObject({
      code: 'UNAUTHORIZED',
      status: 401,
    });

    // Must only be called once — no retry loop triggered
    expect(refreshCallCount).toBe(1);

    mock.restore();
  });

  it('does not issue a second refresh when the retried request also returns 401', async () => {
    const mock = new MockAdapter(axiosInstance, { onNoMatch: 'throwException' });

    let refreshCallCount = 0;

    // Always return 401 — even after a successful refresh
    mock.onGet('/always-401').reply(() => {
      return [401, { code: 'UNAUTHORIZED' }];
    });

    mock.onPost('/auth/refresh').reply(() => {
      refreshCallCount++;
      return [200, {}];
    });

    await expect(axiosInstance.get('/always-401')).rejects.toBeDefined();

    // Only one refresh attempt — the _retry flag prevents a second cycle
    expect(refreshCallCount).toBe(1);

    mock.restore();
  });
});
