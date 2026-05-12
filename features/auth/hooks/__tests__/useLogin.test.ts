import { act, renderHook, waitFor } from '@testing-library/react';

// jest.mock paths must resolve at hoist time — use paths relative to this file.
jest.mock('../../client', () => ({
  login: jest.fn(),
  LoginError: class LoginError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'LoginError';
    }
  },
}));

// Import after mock registration so the hook picks up the mocked module.
import { login as loginClient, LoginError } from '@/features/auth/client';
import { useLogin } from '@/features/auth/hooks/useLogin';

const mockLogin = loginClient as jest.MockedFunction<typeof loginClient>;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const payload = { email: 'user@example.com', password: 'secret123' };
const successResult = { user: { id: 'u1', email: 'user@example.com' } };

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('useLogin', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('initial state', () => {
    it('starts with isLoading false and no error', () => {
      const { result } = renderHook(() => useLogin());

      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe('happy path', () => {
    it('returns the login result on success', async () => {
      mockLogin.mockResolvedValueOnce(successResult);

      const { result } = renderHook(() => useLogin());

      let returned: typeof successResult | undefined;
      await act(async () => {
        returned = await result.current.login(payload);
      });

      expect(returned).toEqual(successResult);
    });

    it('calls the underlying login() with the provided payload', async () => {
      mockLogin.mockResolvedValueOnce(successResult);

      const { result } = renderHook(() => useLogin());

      await act(async () => {
        await result.current.login(payload);
      });

      expect(mockLogin).toHaveBeenCalledTimes(1);
      expect(mockLogin).toHaveBeenCalledWith(payload);
    });

    it('resets error to null on a successful call', async () => {
      // First call fails to prime an error state, second succeeds.
      mockLogin
        .mockRejectedValueOnce(new LoginError('Credenciales inválidas.'))
        .mockResolvedValueOnce(successResult);

      const { result } = renderHook(() => useLogin());

      // First call — produce an error
      await act(async () => {
        await result.current.login(payload).catch(() => undefined);
      });
      expect(result.current.error).not.toBeNull();

      // Second call — should clear the error
      await act(async () => {
        await result.current.login(payload);
      });
      expect(result.current.error).toBeNull();
    });
  });

  describe('loading state', () => {
    it('sets isLoading to true while the call is in-flight', async () => {
      let resolveFn!: (value: typeof successResult) => void;
      const deferred = new Promise<typeof successResult>((resolve) => {
        resolveFn = resolve;
      });
      mockLogin.mockReturnValueOnce(deferred);

      const { result } = renderHook(() => useLogin());

      // Kick off the login without awaiting so we can inspect mid-flight state
      act(() => {
        void result.current.login(payload);
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(true);
      });

      // Resolve the promise and verify loading is cleared
      await act(async () => {
        resolveFn(successResult);
      });

      expect(result.current.isLoading).toBe(false);
    });

    it('sets isLoading back to false after the call rejects', async () => {
      mockLogin.mockRejectedValueOnce(new LoginError('Bad credentials'));

      const { result } = renderHook(() => useLogin());

      await act(async () => {
        await result.current.login(payload).catch(() => undefined);
      });

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('error path', () => {
    it('sets the error message when login() throws a LoginError', async () => {
      mockLogin.mockRejectedValueOnce(new LoginError('Credenciales inválidas.'));

      const { result } = renderHook(() => useLogin());

      await act(async () => {
        await result.current.login(payload).catch(() => undefined);
      });

      expect(result.current.error).toBe('Credenciales inválidas.');
    });

    it('sets a generic error message for non-LoginError rejections', async () => {
      mockLogin.mockRejectedValueOnce(new Error('Network failure'));

      const { result } = renderHook(() => useLogin());

      await act(async () => {
        await result.current.login(payload).catch(() => undefined);
      });

      expect(result.current.error).toBe(
        'No fue posible iniciar sesión. Intenta más tarde.',
      );
    });

    it('re-throws the error so callers can react to it', async () => {
      const thrown = new LoginError('Bad credentials');
      mockLogin.mockRejectedValueOnce(thrown);

      const { result } = renderHook(() => useLogin());

      let caught: unknown;
      await act(async () => {
        await result.current.login(payload).catch((e) => {
          caught = e;
        });
      });

      expect(caught).toBe(thrown);
    });
  });

  describe('reset()', () => {
    it('clears the error state', async () => {
      mockLogin.mockRejectedValueOnce(new LoginError('Bad credentials'));

      const { result } = renderHook(() => useLogin());

      await act(async () => {
        await result.current.login(payload).catch(() => undefined);
      });
      expect(result.current.error).not.toBeNull();

      act(() => {
        result.current.reset();
      });

      expect(result.current.error).toBeNull();
    });
  });
});
