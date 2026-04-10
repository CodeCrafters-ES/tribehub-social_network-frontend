import type {
  LoginPayload,
  LoginResult,
  RegisterPayload,
  RegisterResult,
} from '@/features/auth/types';

export class LoginError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LoginError';
  }
}

export class RegisterError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RegisterError';
  }
}

export async function login(payload: LoginPayload): Promise<LoginResult> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = (await response.json().catch(() => null)) as
    | { message?: string; user?: LoginResult['user'] }
    | null;

  if (!response.ok) {
    throw new LoginError(data?.message ?? 'No fue posible iniciar sesión.');
  }

  return {
    user: data?.user ?? null,
  };
}

export async function register(
  payload: RegisterPayload,
): Promise<RegisterResult> {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = (await response.json().catch(() => null)) as
    | { message?: string; user?: RegisterResult['user']; hasSession?: boolean }
    | null;

  if (!response.ok) {
    throw new RegisterError(
      data?.message ?? 'No fue posible completar el registro.',
    );
  }

  return {
    user: data?.user ?? null,
    hasSession: Boolean(data?.hasSession),
  };
}
