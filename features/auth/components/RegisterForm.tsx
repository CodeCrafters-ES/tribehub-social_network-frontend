'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { register as registerUser, RegisterError } from '@/features/auth/client';
import { registerSchema, type RegisterFormValues } from '@/features/auth/schemas';
import Button from '@/shared/ui/Button';
import Input from '@/shared/ui/Input';

type ServerErrorKind = 'conflict' | 'validation' | 'network';

interface ServerErrorState {
  kind: ServerErrorKind;
  content: React.ReactNode;
}

function resolveConflictMessage(backendMessage: string): React.ReactNode {
  const lower = backendMessage.toLowerCase();

  if (lower.includes('email')) {
    return (
      <>
        Este email ya está registrado.{' '}
        <Link
          href="/login"
          className="font-semibold underline underline-offset-2 transition hover:opacity-80"
        >
          Inicia sesión
        </Link>{' '}
        o usa otro email.
      </>
    );
  }

  if (lower.includes('username') || lower.includes('nombre de usuario')) {
    return 'Este nombre de usuario no está disponible. Elige otro.';
  }

  return (
    <>
      El email o nombre de usuario ya están en uso.{' '}
      <Link
        href="/login"
        className="font-semibold underline underline-offset-2 transition hover:opacity-80"
      >
        Inicia sesión
      </Link>{' '}
      si ya tienes cuenta.
    </>
  );
}

const ERROR_STYLES: Record<ServerErrorKind, string> = {
  conflict:
    'rounded-xl border border-amber-300 bg-amber-50 px-3 py-2.5 text-sm font-medium text-amber-800',
  validation:
    'rounded-xl border border-red-300 bg-red-50 px-3 py-2.5 text-sm font-medium text-brand-danger',
  network:
    'rounded-xl border border-red-300 bg-red-50 px-3 py-2.5 text-sm font-medium text-brand-danger',
};

export default function RegisterForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<ServerErrorState | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onTouched',
  });

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);

    try {
      const result = await registerUser({
        username: values.username,
        email: values.email,
        password: values.password,
      });

      // Supabase requires email confirmation before login is possible.
      // Redirect to a confirmation notice page regardless of session state.
      if (result.hasSession) {
        router.replace('/feed');
      } else {
        router.replace('/register/confirm-email');
      }
    } catch (error) {
      if (error instanceof RegisterError) {
        if (error.statusCode === 409) {
          setServerError({
            kind: 'conflict',
            content: resolveConflictMessage(error.message),
          });
        } else if (error.statusCode === 400) {
          setServerError({
            kind: 'validation',
            content: error.message,
          });
        } else {
          setServerError({
            kind: 'network',
            content: 'No fue posible completar el registro. Intenta más tarde.',
          });
        }
      } else {
        setServerError({
          kind: 'network',
          content: 'No fue posible completar el registro. Intenta más tarde.',
        });
      }
    }
  });

  return (
    <form
      className="w-full max-w-[420px] space-y-4 rounded-2xl border border-brand-border bg-brand-surface p-7 shadow-card"
      onSubmit={onSubmit}
      noValidate
    >
      <header>
        <h1 className="text-3xl font-semibold leading-tight text-brand-textMain">
          Crea tu cuenta
        </h1>
        <p className="mt-1 text-sm text-brand-textMuted">
          Únete a TribeHub y conecta con tus comunidades.
        </p>
      </header>

      {serverError && (
        <div
          className={ERROR_STYLES[serverError.kind]}
          role="alert"
        >
          {serverError.content}
        </div>
      )}

      <Input
        id="username"
        label="Nombre de usuario"
        type="text"
        autoComplete="username"
        placeholder="tu_nombre"
        error={errors.username?.message}
        {...register('username')}
      />

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
        autoComplete="new-password"
        hint="Mín. 8 caracteres, 1 número y 1 símbolo"
        error={errors.password?.message}
        {...register('password')}
      />

      <Input
        id="confirmPassword"
        label="Confirmar contraseña"
        type="password"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />

      <Button type="submit" isLoading={isSubmitting}>
        Crear cuenta
      </Button>

      <p className="text-center text-sm text-brand-textMuted">
        ¿Ya tienes cuenta?{' '}
        <Link
          href="/login"
          className="font-semibold text-brand-accent underline-offset-4 transition hover:text-brand-accentHover hover:underline"
        >
          Inicia sesión
        </Link>
      </p>
    </form>
  );
}
