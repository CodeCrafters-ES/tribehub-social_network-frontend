/**
 * Profile API service — uses BFF route internally (/api/v1/profile).
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
