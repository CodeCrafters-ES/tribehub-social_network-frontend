'use client';

import { useId, useState } from 'react';

import {
  type BackendPrivacyLevel,
  type UiPrivacyLevel,
  normalizePrivacyLevel,
  profileApi,
} from '@/services/api/profile';
import Switch from '@/shared/ui/Switch';

export interface ProfileVisibilityToggleProps {
  /** Initial value coming from the backend. `friends` is treated as `private`. */
  initialPrivacyLevel?: BackendPrivacyLevel;
  /** Notified after a successful update. */
  onChange?: (level: UiPrivacyLevel) => void;
  /** External disabled flag (e.g. while a parent form is busy). */
  disabled?: boolean;
}

const HELPER_TEXT: Record<UiPrivacyLevel, string> = {
  public: 'Cualquiera puede ver tu perfil.',
  private: 'Solo tú puedes ver tu perfil.',
};

const GENERIC_ERROR =
  'No fue posible actualizar la visibilidad. Inténtalo de nuevo.';

export default function ProfileVisibilityToggle({
  initialPrivacyLevel,
  onChange,
  disabled = false,
}: ProfileVisibilityToggleProps) {
  const helperId = useId();
  const errorId = useId();

  const [privacyLevel, setPrivacyLevel] = useState<UiPrivacyLevel>(() =>
    normalizePrivacyLevel(initialPrivacyLevel),
  );
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isPublic = privacyLevel === 'public';

  const handleToggle = async (nextChecked: boolean) => {
    if (isSaving || disabled) return;

    const previous = privacyLevel;
    const next: UiPrivacyLevel = nextChecked ? 'public' : 'private';

    if (next === previous) return;

    setError(null);
    setPrivacyLevel(next); // optimistic update
    setIsSaving(true);

    try {
      await profileApi.updateProfile({ privacy_level: next });
      onChange?.(next);
    } catch {
      setPrivacyLevel(previous); // rollback
      setError(GENERIC_ERROR);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-brand-border bg-brand-surface p-4 shadow-card">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-brand-textMain">
            Perfil público
          </span>
          <span id={helperId} className="text-xs text-brand-textMuted">
            {HELPER_TEXT[privacyLevel]}
          </span>
        </div>
        <Switch
          checked={isPublic}
          onCheckedChange={handleToggle}
          disabled={disabled || isSaving}
          label="Perfil público"
          aria-describedby={error ? errorId : helperId}
          aria-busy={isSaving}
        />
      </div>

      {error && (
        <p
          id={errorId}
          role="alert"
          className="text-xs font-medium text-brand-danger"
        >
          {error}
        </p>
      )}
    </div>
  );
}
