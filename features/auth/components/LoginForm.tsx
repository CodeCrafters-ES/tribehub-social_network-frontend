'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { login, LoginError } from '@/features/auth/client';
import Button from '@/shared/ui/Button';
import Input from '@/shared/ui/Input';

type FormErrors = {
  email?: string;
  password?: string;
};

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const nextErrors: FormErrors = {};

    if (!email.trim()) {
      nextErrors.email = 'Ingresa un email válido.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = 'El email debe tener un formato válido.';
    }

    if (!password) {
      nextErrors.password = 'Ingresa tu contraseña.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = () => {
    if (serverError) setServerError(null);
    if (errors.email || errors.password) {
      setErrors({});
    }
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setServerError(null);

    if (!validate()) {
      return;
    }

    setIsLoading(true);

    try {
      await login({ email, password });

      const nextPath = searchParams.get('next');
      const isAuthGroupPath =
        nextPath?.startsWith('/login') || nextPath?.startsWith('/register');
      const safePath =
        nextPath &&
        nextPath.startsWith('/') &&
        !nextPath.startsWith('//') &&
        !isAuthGroupPath
          ? nextPath
          : '/feed';

      router.replace(safePath);
      router.refresh();
    } catch (err) {
      if (err instanceof LoginError) {
        setServerError(err.message);
      } else {
        setServerError('No fue posible iniciar sesión. Intenta más tarde.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className="w-full max-w-[420px] animate-[slide-up_320ms_ease-out] space-y-4 rounded-2xl border border-brand-border bg-brand-surface p-7 shadow-card"
      onSubmit={onSubmit}
      noValidate
    >
      <header>
        <h1 className="text-3xl font-semibold leading-tight text-brand-textMain">
          Inicia sesión en TribeHub
        </h1>
        <p className="mt-1 text-sm text-brand-textMuted">
          Conecta con tus comunidades y vuelve al feed.
        </p>
      </header>

      {serverError && (
        <div
          className="rounded-xl border border-red-300 bg-red-50 px-3 py-2.5 text-sm font-medium text-brand-danger"
          role="alert"
        >
          {serverError}
        </div>
      )}

      <Input
        id="email"
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="user@example.com"
        value={email}
        onChange={(event) => {
          setEmail(event.target.value);
          handleChange();
        }}
        error={errors.email}
      />

      <Input
        id="password"
        label="Contraseña"
        type="password"
        autoComplete="current-password"
        placeholder="********"
        value={password}
        onChange={(event) => {
          setPassword(event.target.value);
          handleChange();
        }}
        error={errors.password}
      />

      <Button type="submit" isLoading={isLoading}>
        Entrar
      </Button>

      <p className="text-center text-sm text-brand-textMuted">
        ¿No tienes cuenta?{' '}
        <Link
          href="/register"
          className="font-semibold text-brand-accent underline-offset-4 transition hover:text-brand-accentHover hover:underline"
        >
          Regístrate
        </Link>
      </p>
    </form>
  );
}
