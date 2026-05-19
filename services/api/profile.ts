/**
 * Profile API service — uses BFF route internally (/api/v1/profile).
 *
 * IMPORTANT: Types must match backend DTO (src/modules/profile/dto/update-profile.dto.ts)
 * - displayName: required, 2-50 chars
 * - bio: optional, max 160 chars
 * - avatarUrl: optional, must be valid URL
 */

/**
 * Privacy level returned by the backend. The MVP UI only surfaces
 * `public` and `private`; `friends` is normalized to `private`.
 */
export type BackendPrivacyLevel = 'public' | 'private' | 'friends';
export type UiPrivacyLevel = 'public' | 'private';

export function normalizePrivacyLevel(
  value: BackendPrivacyLevel | undefined | null,
): UiPrivacyLevel {
  return value === 'public' ? 'public' : 'private';
}

export interface ProfileResponse {
  id: string;
  userId: string;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
  privacy_level?: BackendPrivacyLevel;
}

export interface UpdateProfilePayload {
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  privacy_level?: UiPrivacyLevel;
}

const getProfile = async (): Promise<ProfileResponse> => {
  const response = await fetch('/api/v1/profile', {
    method: 'GET',
    credentials: 'same-origin',
  });

  const status = response.status;

  if (!response.ok) {
    const error = new Error('Failed to fetch profile') as Error & {
      status?: number;
    };
    error.status = status;
    throw error;
  }

  return response.json();
};

const updateProfile = async (
  payload: UpdateProfilePayload,
): Promise<ProfileResponse> => {
  const response = await fetch('/api/v1/profile', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    credentials: 'same-origin',
  });

  if (!response.ok) {
    const error = new Error('Failed to update profile') as Error & {
      status?: number;
    };
    error.status = response.status;
    throw error;
  }

  return response.json();
};

export const profileApi = {
  getProfile,
  updateProfile,
};

export { getProfile, updateProfile };
