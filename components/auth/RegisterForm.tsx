'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { register, RegisterError } from '@/lib/auth/client';

type RegisterFormValues = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type RegisterFormErrors = Partial<Record<keyof RegisterFormValues, string>>;

function validate(values: RegisterFormValues): RegisterFormErrors {
  const errors: RegisterFormErrors = {};

  if (!values.username.trim()) {
    errors.username = 'El nombre de usuario es obligatorio.';
  } else if (values.username.includes(' ')) {
    errors.username = 'El nombre de usuario no puede contener espacios.';
  } else if (values.username.trim().length < 2) {
    errors.username = 'El nombre de usuario debe tener al menos 2 caracteres.';
  }

  if (!values.email.trim()) {
    errors.email = 'El email es obligatorio.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Ingresa un email válido.';
  }

  if (!values.password) {
    errors.password = 'La contraseña es obligatoria.';
  } else if (values.password.length < 8) {
    errors.password = 'La contraseña debe tener al menos 8 caracteres.';
  } else if (!/[a-z]/.test(values.password)) {
    errors.password = 'La contraseña debe tener al menos una letra minúscula.';
  } else if (!/[0-9]/.test(values.password)) {
    errors.password = 'La contraseña debe tener al menos un número.';
  } else if (!/[^A-Za-z0-9]/.test(values.password)) {
    errors.password = 'La contraseña debe tener al menos un símbolo (ej. @, !, #).';
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Confirma tu contraseña.';
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = 'Las contraseñas no coinciden.';
  }

  return errors;
}

export default function RegisterForm() {
  const router = useRouter();
  const [values, setValues] = useState<RegisterFormValues>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = validate(values);
    setErrors(validationErrors);
    setServerError(null);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await register({
        username: values.username.trim(),
        email: values.email.trim().toLowerCase(),
        password: values.password,
      });

      if (result.hasSession) {
        router.replace('/feed');
      } else {
        router.replace('/login?registered=1');
      }

      router.refresh();
    } catch (error) {
      if (error instanceof RegisterError) {
        setServerError(error.message);
      } else {
        setServerError('No fue posible completar el registro. Intenta más tarde.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      className="w-full max-w-[460px] animate-[slide-up_320ms_ease-out] space-y-4 rounded-2xl border border-brand-border bg-brand-surface p-7 shadow-card"
      onSubmit={onSubmit}
      noValidate
    >
      <header>
        <h1 className="text-3xl font-semibold leading-tight text-brand-textMain">
          Crea tu cuenta en TribeHub
        </h1>
        <p className="mt-1 text-sm text-brand-textMuted">
          Únete a tus comunidades y empieza a compartir.
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
        id="username"
        name="username"
        label="Nombre de usuario"
        type="text"
        autoComplete="username"
        placeholder="sin espacios, ej. juanperez"
        value={values.username}
        error={errors.username}
        onChange={(event) =>
          setValues((prev) => ({ ...prev, username: event.target.value }))
        }
      />

      <Input
        id="email"
        name="email"
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="user@example.com"
        value={values.email}
        error={errors.email}
        onChange={(event) =>
          setValues((prev) => ({ ...prev, email: event.target.value }))
        }
      />

      <Input
        id="password"
        name="password"
        label="Contraseña"
        type="password"
        autoComplete="new-password"
        placeholder="Mín. 8 chars, número y símbolo"
        value={values.password}
        error={errors.password}
        onChange={(event) =>
          setValues((prev) => ({ ...prev, password: event.target.value }))
        }
      />

      <Input
        id="confirmPassword"
        name="confirmPassword"
        label="Confirmar contraseña"
        type="password"
        autoComplete="new-password"
        placeholder="Repite tu contraseña"
        value={values.confirmPassword}
        error={errors.confirmPassword}
        onChange={(event) =>
          setValues((prev) => ({
            ...prev,
            confirmPassword: event.target.value,
          }))
        }
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
