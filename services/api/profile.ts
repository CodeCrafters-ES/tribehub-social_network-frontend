/**
 * Profile API service — usa el route handler BFF interno (/api/v1/profile).
 *
 * El backend espera Authorization: Bearer pero el frontend usa cookie httpOnly.
 * El route handler /api/v1/profile valida la cookie server-side y la reenvía
 * como Bearer al backend.
 */

export interface ProfileResponse {
  id: string;
  userId: string;
  displayName: string;
  bio: string;
  avatarUrl: string | null;
  isPublic: boolean;
}

export interface UpdateProfilePayload {
  displayName?: string;
  bio?: string;
  avatarUrl?: string | null;
  isPublic?: boolean;
}

const getProfile = async (): Promise<ProfileResponse> => {
  const response = await fetch('/api/v1/profile', {
    method: 'GET',
    credentials: 'same-origin',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch profile');
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
    throw new Error('Failed to update profile');
  }

  return response.json();
};

export const profileApi = {
  getProfile,
  updateProfile,
};

// Named exports for tests
export { getProfile, updateProfile };
