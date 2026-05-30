import MockAdapter from 'axios-mock-adapter';
import { axiosInstance } from '../axios';

describe('XSRF-TOKEN header injection', () => {
  const originalCookieDescriptor = Object.getOwnPropertyDescriptor(document, 'cookie');

  beforeEach(() => {
    Object.defineProperty(document, 'cookie', {
      writable: true,
      value: '',
    });
  });

  afterAll(() => {
    if (originalCookieDescriptor) {
      Object.defineProperty(document, 'cookie', originalCookieDescriptor);
    }
  });

  it('injects x-xsrf-token header when XSRF-TOKEN cookie is present', async () => {
    const mock = new MockAdapter(axiosInstance);
    let capturedHeaders: Record<string, string> = {};

    Object.defineProperty(document, 'cookie', {
      writable: true,
      value: 'XSRF-TOKEN=test-csrf-token-123',
    });

    mock.onGet('/test').reply((config) => {
      capturedHeaders = config.headers as Record<string, string>;
      return [200, {}];
    });

    await axiosInstance.get('/test');

    expect(capturedHeaders['x-xsrf-token']).toBe('test-csrf-token-123');
    mock.restore();
  });

  it('does not inject x-xsrf-token when XSRF-TOKEN cookie is absent', async () => {
    const mock = new MockAdapter(axiosInstance);
    let capturedHeaders: Record<string, string> = {};

    Object.defineProperty(document, 'cookie', {
      writable: true,
      value: 'other-cookie=value',
    });

    mock.onGet('/test-no-xsrf').reply((config) => {
      capturedHeaders = config.headers as Record<string, string>;
      return [200, {}];
    });

    await axiosInstance.get('/test-no-xsrf');

    expect(capturedHeaders['x-xsrf-token']).toBeUndefined();
    mock.restore();
  });
});
