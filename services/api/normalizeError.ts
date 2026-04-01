import type { AxiosError } from 'axios';
import type { ApiError } from './apiError';

/**
 * Shape of the backend's standard error response body.
 * The backend may send any subset of these fields.
 */
interface BackendErrorBody {
  code?: string;
  message?: string;
  details?: unknown;
  error?: string;
  statusCode?: number;
}

/**
 * Converts any thrown value (AxiosError, network error, or unknown) into
 * a normalized ApiError that UI layers can consume uniformly.
 *
 * Resolution order for each field:
 *  - code:      response.data.code → response.data.error → HTTP status label → "UNKNOWN_ERROR"
 *  - message:   response.data.message → generic fallback
 *  - status:    response.status → 0 for network/unknown errors
 *  - requestId: X-Request-Id response header, if present
 */
export function normalizeError(error: unknown): ApiError {
  if (!isAxiosError(error)) {
    return {
      code: 'UNKNOWN_ERROR',
      message:
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred.',
      status: 0,
    };
  }

  const response = error.response;
  const requestId =
    (response?.headers?.['x-request-id'] as string | undefined) ?? undefined;

  // Network error (no response received at all)
  if (!response) {
    return {
      code: 'NETWORK_ERROR',
      message: 'Unable to reach the server. Please check your connection.',
      status: 0,
      requestId,
    };
  }

  const body = (response.data ?? {}) as BackendErrorBody;
  const code =
    body.code ??
    body.error ??
    httpStatusToCode(response.status);

  const message =
    body.message ?? defaultMessageForStatus(response.status);

  return {
    code,
    message,
    details: body.details,
    status: response.status,
    requestId,
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isAxiosError(error: unknown): error is AxiosError {
  return (
    typeof error === 'object' &&
    error !== null &&
    (error as Record<string, unknown>).isAxiosError === true
  );
}

function httpStatusToCode(status: number): string {
  const codes: Record<number, string> = {
    400: 'BAD_REQUEST',
    401: 'UNAUTHORIZED',
    403: 'FORBIDDEN',
    404: 'NOT_FOUND',
    409: 'CONFLICT',
    422: 'UNPROCESSABLE_ENTITY',
    429: 'TOO_MANY_REQUESTS',
    500: 'INTERNAL_SERVER_ERROR',
    502: 'BAD_GATEWAY',
    503: 'SERVICE_UNAVAILABLE',
  };
  return codes[status] ?? `HTTP_${status}`;
}

function defaultMessageForStatus(status: number): string {
  const messages: Record<number, string> = {
    400: 'The request was invalid.',
    401: 'You are not authenticated.',
    403: 'You do not have permission to perform this action.',
    404: 'The requested resource was not found.',
    409: 'A conflict occurred with the current state of the resource.',
    422: 'The provided data could not be processed.',
    429: 'Too many requests. Please slow down.',
    500: 'An internal server error occurred.',
    502: 'Received an invalid response from the upstream server.',
    503: 'The service is temporarily unavailable.',
  };
  return messages[status] ?? 'An unexpected error occurred.';
}
