import { normalizeError } from '../normalizeError';

// ---------------------------------------------------------------------------
// Helpers — build minimal AxiosError-shaped objects without importing axios
// ---------------------------------------------------------------------------

function makeAxiosError(
  status?: number,
  body?: Record<string, unknown>,
  responseHeaders?: Record<string, string>,
): unknown {
  return {
    isAxiosError: true,
    response: status !== undefined
      ? {
          status,
          data: body ?? {},
          headers: responseHeaders ?? {},
        }
      : undefined,
    config: {},
    message: 'Request failed',
  };
}

function makeNetworkError(): unknown {
  return {
    isAxiosError: true,
    response: undefined,
    config: {},
    message: 'Network Error',
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('normalizeError', () => {
  describe('non-Axios errors', () => {
    it('normalizes a plain Error to UNKNOWN_ERROR with status 0', () => {
      const result = normalizeError(new Error('boom'));
      expect(result.code).toBe('UNKNOWN_ERROR');
      expect(result.message).toBe('boom');
      expect(result.status).toBe(0);
      expect(result.requestId).toBeUndefined();
    });

    it('normalizes a thrown string to UNKNOWN_ERROR', () => {
      const result = normalizeError('something went wrong');
      expect(result.code).toBe('UNKNOWN_ERROR');
      expect(result.status).toBe(0);
    });

    it('normalizes null to UNKNOWN_ERROR', () => {
      const result = normalizeError(null);
      expect(result.code).toBe('UNKNOWN_ERROR');
      expect(result.status).toBe(0);
    });
  });

  describe('network errors (no response)', () => {
    it('returns NETWORK_ERROR when there is no response', () => {
      const result = normalizeError(makeNetworkError());
      expect(result.code).toBe('NETWORK_ERROR');
      expect(result.status).toBe(0);
    });
  });

  describe('HTTP error responses', () => {
    it('uses code from response body when present', () => {
      const error = makeAxiosError(400, { code: 'VALIDATION_FAILED', message: 'Bad data' });
      const result = normalizeError(error);
      expect(result.code).toBe('VALIDATION_FAILED');
      expect(result.message).toBe('Bad data');
      expect(result.status).toBe(400);
    });

    it('falls back to error field when code is absent', () => {
      const error = makeAxiosError(409, { error: 'EMAIL_TAKEN' });
      const result = normalizeError(error);
      expect(result.code).toBe('EMAIL_TAKEN');
      expect(result.status).toBe(409);
    });

    it('falls back to HTTP status code label when no code or error', () => {
      const error = makeAxiosError(404, {});
      const result = normalizeError(error);
      expect(result.code).toBe('NOT_FOUND');
    });

    it('uses HTTP_{status} for unmapped status codes', () => {
      const error = makeAxiosError(418, {});
      const result = normalizeError(error);
      expect(result.code).toBe('HTTP_418');
    });

    it('uses message from body when present', () => {
      const error = makeAxiosError(422, { message: 'Email is invalid' });
      const result = normalizeError(error);
      expect(result.message).toBe('Email is invalid');
    });

    it('falls back to default message when body has no message', () => {
      const error = makeAxiosError(403, {});
      const result = normalizeError(error);
      expect(result.message).toBe('You do not have permission to perform this action.');
    });

    it('includes details when present in the body', () => {
      const details = [{ field: 'email', issue: 'required' }];
      const error = makeAxiosError(400, { code: 'VALIDATION', details });
      const result = normalizeError(error);
      expect(result.details).toEqual(details);
    });

    it('does not include details when absent', () => {
      const error = makeAxiosError(500, {});
      const result = normalizeError(error);
      expect(result.details).toBeUndefined();
    });
  });

  describe('X-Request-Id propagation', () => {
    it('attaches requestId from X-Request-Id response header', () => {
      const error = makeAxiosError(
        500,
        {},
        { 'x-request-id': 'abc-123' },
      );
      const result = normalizeError(error);
      expect(result.requestId).toBe('abc-123');
    });

    it('leaves requestId undefined when header is absent', () => {
      const error = makeAxiosError(500, {});
      const result = normalizeError(error);
      expect(result.requestId).toBeUndefined();
    });
  });
});
