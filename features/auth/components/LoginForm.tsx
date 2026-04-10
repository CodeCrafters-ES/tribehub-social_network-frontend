'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { login, LoginError } from '@/features/auth/client';
import { loginSchema, type LoginFormValues } from '@/features/auth/schemas';
import Button from '@/shared/ui/Button';
import Input from '@/shared/ui/Input';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);

    try {
      await login(values);

      const nextPath = searchParams.get('next');
      const safePath =
        nextPath && nextPath.startsWith('/') && !nextPath.startsWith('//')
          ? nextPath
          : '/feed';

      router.replace(safePath);
      router.refresh();
    } catch (error) {
      if (error instanceof LoginError) {
        setServerError(error.message);
      } else {
        setServerError('No fue posible iniciar sesión. Intenta más tarde.');
      }
    }
  });

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
        error={errors.email?.message}
        {...register('email')}
      />

      <Input
        id="password"
        label="Contraseña"
        type="password"
        autoComplete="current-password"
        placeholder="********"
        error={errors.password?.message}
        {...register('password')}
      />

      <Button type="submit" isLoading={isSubmitting}>
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
