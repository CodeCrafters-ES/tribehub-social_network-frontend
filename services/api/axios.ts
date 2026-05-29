/**
 * Axios instance with:
 *  - baseURL from NEXT_PUBLIC_API_BASE_URL env var
 *  - withCredentials: true (httpOnly cookie refresh token strategy)
 *  - 10 s timeout
 *  - X-Request-Id header injected on every request
 *  - 401 → refresh → retry (thundering herd prevention)
 *  - Error normalization via normalizeError()
 */
import axios, {
  type AxiosInstance,
  type AxiosError,
  type InternalAxiosRequestConfig,
} from 'axios';
import { normalizeError } from './normalizeError';

// ---------------------------------------------------------------------------
// Internal types
// ---------------------------------------------------------------------------

/**
 * Extend InternalAxiosRequestConfig to carry our retry flag.
 * Using module augmentation keeps the rest of the codebase clean.
 */
interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// ---------------------------------------------------------------------------
// Instance
// ---------------------------------------------------------------------------

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000/api/v1';

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // send httpOnly refresh-token cookie automatically
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ---------------------------------------------------------------------------
// Request interceptor — attach X-Request-Id
// ---------------------------------------------------------------------------

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // crypto.randomUUID() is available in all modern browsers and Node 14.17+
    const requestId =
      typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    config.headers.set('X-Request-Id', requestId);
    return config;
  },
  (error: unknown) => Promise.reject(error),
);

// ---------------------------------------------------------------------------
// Token refresh state — shared across all pending 401 responses
// ---------------------------------------------------------------------------

let isRefreshing = false;
// Each resolve callback will be called with the new access token (or undefined
// when it is stored in a cookie — in that case callers just retry).
let pendingQueue: Array<{
  resolve: (value?: string) => void;
  reject: (reason: unknown) => void;
}> = [];

function processPendingQueue(error: unknown, token?: string): void {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  pendingQueue = [];
}

// ---------------------------------------------------------------------------
// Response interceptor — 401 → refresh → retry + error normalization
// ---------------------------------------------------------------------------

axiosInstance.interceptors.response.use(
  // Pass-through successful responses
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    const status = error.response?.status;
    const isRefreshEndpoint = originalRequest?.url?.includes('/auth/refresh');

    // Only intercept 401s that have not already been retried and are not the
    // refresh endpoint itself (to avoid infinite loops).
    if (
      status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isRefreshEndpoint
    ) {
      if (isRefreshing) {
        // Queue this request — it will be retried after the in-flight refresh
        // resolves (or rejected if the refresh fails).
        return new Promise<unknown>((resolve, reject) => {
          pendingQueue.push({
            resolve: () => resolve(axiosInstance(originalRequest)),
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // POST /auth/refresh relies on the httpOnly cookie being sent via
        // withCredentials — no token body needed.
        await axiosInstance.post('/auth/refresh');

        processPendingQueue(null);
        isRefreshing = false;

        // Retry the original failed request
        return await axiosInstance(originalRequest);
      } catch (refreshError) {
        processPendingQueue(refreshError);
        isRefreshing = false;

        // Clear any client-side session state and redirect to login.
        // We use window.location to ensure a hard redirect that resets
        // all React state, regardless of which router is active.
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }

        return Promise.reject(normalizeError(refreshError));
      }
    }

    // Normalize all other errors before propagating to callers
    return Promise.reject(normalizeError(error));
  },
);
