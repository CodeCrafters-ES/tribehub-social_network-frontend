/**
 * Public API client — the single entry point for all feature-layer HTTP calls.
 *
 * Import this (not the raw axiosInstance) in features and hooks:
 *
 *   import { apiClient } from '@/services/api/apiClient';
 *   const data = await apiClient.get<User>('/users/me');
 *
 * The underlying Axios instance already handles:
 *  - baseURL (NEXT_PUBLIC_API_BASE_URL)
 *  - withCredentials: true
 *  - X-Request-Id header injection
 *  - 401 → token refresh → retry
 *  - Error normalization to ApiError
 */
export { axiosInstance as apiClient } from './axios';
export type { ApiError } from './apiError';
