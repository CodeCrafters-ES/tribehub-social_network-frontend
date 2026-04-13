'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Button from '@/shared/ui/Button';
import Input from '@/shared/ui/Input';
import {
  profileApi,
  ProfileResponse,
  UpdateProfilePayload,
} from '@/services/api/profile';

// Constants
const ONBOARDING_NEXT_STEP = '/feed';

// Validation schema - match LoginForm pattern (all required, no defaults in schema)
const profileSchema = z.object({
  displayName: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres.')
    .max(50, 'El nombre no debe exceder los 50 caracteres.'),
  bio: z.string().max(280, 'La biografía no debe exceder los 280 caracteres.'),
  avatarUrl: z.string(),
  isPublic: z.boolean(),
});

// Define form values type - match what LoginForm does
type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: '',
      bio: '',
      avatarUrl: '',
      isPublic: true,
    },
  });

  const isPublic = watch('isPublic');

  // Fetch profile on mount
  useEffect(() => {
    profileApi
      .getProfile()
      .then((data: ProfileResponse) => {
        // If profile already has displayName, redirect to feed (already complete)
        if (data.displayName) {
          router.replace(ONBOARDING_NEXT_STEP);
          return;
        }
        reset({
          displayName: data.displayName ?? '',
          bio: data.bio ?? '',
          avatarUrl: data.avatarUrl ?? '',
          isPublic: data.isPublic ?? true,
        });
      })
      .catch((err: unknown) => {
        // 404 means new user - show empty form (normal, not an error)
        const axiosErr = err as { response?: { status?: number } };
        const isNotFound = axiosErr.response?.status === 404;

        // Only show error for actual connection/server issues
        if (!isNotFound) {
          setApiError('No pudimos cargar tu perfil. Intenta de nuevo.');
        }
      })
      .finally(() => setIsLoading(false));
  }, [router, reset]);

  const onSubmit = async (values: ProfileFormValues) => {
    setApiError(null);
    try {
      await profileApi.updateProfile(values as UpdateProfilePayload);
      router.replace(ONBOARDING_NEXT_STEP);
    } catch (error) {
      setApiError('Error al guardar tu perfil. Intenta de nuevo.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4.5rem)] items-center justify-center">
        <div className="animate-pulse">
          <div className="h-4 w-24 rounded bg-brand-surface"></div>
          <div className="mt-2 h-4 w-16 rounded bg-brand-surface"></div>
          <div className="mt-2 h-4 w-32 rounded bg-brand-surface"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4.5rem)] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-[420px] space-y-6">
        <div className="space-y-4">
          <h1 className="text-3xl font-semibold leading-tight text-brand-textMain">
            Completa tu perfil
          </h1>
          <p className="mt-1 text-sm text-brand-textMuted">
            Ayúdanos a conocerte mejor para personalizar tu experiencia.
          </p>
        </div>

        {apiError && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
            {apiError}
          </div>
        )}

        <form
          className="space-y-4"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <Input
            id="displayName"
            label="Nombre de visualización"
            placeholder="Tu nombre o alias"
            error={errors.displayName?.message}
            {...register('displayName')}
            required
          />

          <div className="flex flex-col gap-1">
            <label
              htmlFor="bio"
              className="text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              Biografía
            </label>
            <textarea
              id="bio"
              rows={4}
              placeholder="Cuéntanos sobre ti (máx. 280 caracteres)"
              className={[
                'rounded-md border px-3 py-2 text-sm outline-none transition-colors',
                'bg-white dark:bg-slate-900',
                'text-slate-900 dark:text-slate-100',
                'placeholder:text-slate-400 dark:placeholder:text-slate-500',
                errors.bio
                  ? 'border-red-500 focus:ring-2 focus:ring-red-400'
                  : 'border-slate-300 dark:border-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400',
              ]
                .filter(Boolean)
                .join(' ')}
              {...register('bio')}
              aria-describedby={errors.bio ? 'bio-error' : 'bio-hint'}
              aria-invalid={errors.bio ? 'true' : undefined}
            />
            {!errors.bio && (
              <p
                id="bio-hint"
                className="text-xs text-slate-500 dark:text-slate-400"
              >
                Cuéntanos sobre ti (máx. 280 caracteres)
              </p>
            )}
            {errors.bio && (
              <p
                id="bio-error"
                role="alert"
                className="text-xs text-red-600 dark:text-red-400"
              >
                {errors.bio.message}
              </p>
            )}
          </div>

          <Input
            id="avatarUrl"
            label="URL del avatar (opcional)"
            placeholder="https://ejemplo.com/avatar.jpg"
            error={errors.avatarUrl?.message}
            {...register('avatarUrl')}
          />

          <div className="flex items-start space-x-3">
            <input
              id="isPublic"
              type="checkbox"
              checked={isPublic ?? true}
              onChange={(e) => setValue('isPublic', e.target.checked)}
              className="h-4 w-4 text-brand-accent focus:ring-brand-accent border-brand-border rounded"
            />
            <label
              htmlFor="isPublic"
              className="mt-0.5 text-sm text-brand-textMuted"
            >
              Perfil público (visible para todos)
            </label>
          </div>

          <Button type="submit" isLoading={isSubmitting} className="w-full">
            Guardar y continuar
          </Button>
        </form>
      </div>
    </div>
  );
}
