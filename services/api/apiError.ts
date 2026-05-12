/**
 * Standard normalized error shape returned by all API calls.
 * Maps backend error responses and Axios errors into a consistent format
 * that UI components can depend on without inspecting raw HTTP details.
 */
export interface ApiError {
  /** Machine-readable error code (e.g. "UNAUTHORIZED", "NOT_FOUND"). */
  code: string;
  /** Human-readable message safe to display in the UI. */
  message: string;
  /** Optional structured validation details or extra context from the server. */
  details?: unknown;
  /** HTTP status code of the response that produced this error. */
  status: number;
  /** The X-Request-Id from the response, if the server echoed it. */
  requestId?: string;
}
