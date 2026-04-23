'use client';

import { useState } from 'react';

import { login, LoginError } from '@/features/auth/client';
import type { LoginPayload, LoginResult } from '@/features/auth/types';

export interface UseLoginReturn {
  login: (payload: LoginPayload) => Promise<LoginResult>;
  isLoading: boolean;
  error: string | null;
  reset: () => void;
}

export function useLogin(): UseLoginReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = () => setError(null);

  const execute = async (payload: LoginPayload): Promise<LoginResult> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await login(payload);
      return result;
    } catch (err) {
      const message =
        err instanceof LoginError
          ? err.message
          : 'No fue posible iniciar sesión. Intenta más tarde.';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { login: execute, isLoading, error, reset };
}
