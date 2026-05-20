'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Button from '@/shared/ui/Button';
import Input from '@/shared/ui/Input';
import { profileApi } from '@/services/api/profile';
import type { ProfileResponse, UpdateProfilePayload } from '@/features/profile/types';
import { profileSchema, type ProfileFormValues } from './schema';

// Constants
const ONBOARDING_NEXT_STEP = '/feed';

/**
 * Cleans payload to match backend DTO.
 * - Removes empty strings and undefined values
 * - Only sends fields that backend expects
 */
function cleanPayload(values: ProfileFormValues): UpdateProfilePayload {
  const payload: UpdateProfilePayload = {
    displayName: values.displayName,
  };

  // Only add optional fields if they have meaningful values
  if (values.bio && values.bio.trim()) {
    payload.bio = values.bio.trim();
  }

  if (values.avatarUrl && values.avatarUrl.trim()) {
    payload.avatarUrl = values.avatarUrl.trim();
  }

  return payload;
}

export default function ProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: '',
      bio: undefined,
      avatarUrl: undefined,
    },
  });

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
          bio: data.bio ?? undefined,
          avatarUrl: data.avatarUrl ?? undefined,
        });
      })
      .catch((err: unknown) => {
        // 404 means new user - show empty form (normal, not an error)
        const errorWithStatus = err as { status?: number };
        const isNotFound = errorWithStatus.status === 404;

        // Only show error for actual connection/server issues
        if (!isNotFound) {
          console.error('Error loading profile:', err);
          setApiError('No pudimos cargar tu perfil. Intenta de nuevo.');
        }
      })
      .finally(() => setIsLoading(false));
  }, [router, reset]);

  const onSubmit = async (values: ProfileFormValues) => {
    setApiError(null);
    // Clean payload to match backend DTO (no isPublic, no empty strings)
    const payload = cleanPayload(values);

    try {
      await profileApi.updateProfile(payload);
      router.replace(ONBOARDING_NEXT_STEP);
    } catch (error) {
      console.error('Error updating profile:', error);
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
          <div
            role="alert"
            aria-live="polite"
            className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400"
          >
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
              placeholder="Cuéntanos sobre ti (máx. 160 caracteres)"
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
                Cuéntanos sobre ti (máx. 160 caracteres)
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

          <Button type="submit" isLoading={isSubmitting} className="w-full">
            Guardar y continuar
          </Button>
        </form>
      </div>
    </div>
  );
}
