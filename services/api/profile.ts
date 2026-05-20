/**
 * Profile API service — usa el BFF route internamente (/api/v1/profile).
 *
 * IMPORTANTE: Los tipos de dominio viven en features/profile/types
 * para cumplir con la arquitectura FSD.
 * Este archivo solo contiene la implementación del cliente HTTP.
 *
 * Los tipos deben coincidir con el DTO del backend
 * (src/modules/profile/dto/update-profile.dto.ts)
 */

import { apiClient } from './apiClient';
import type {
  ProfileResponse,
  UpdateProfilePayload,
} from '@/features/profile/types';

/**
 * Obtiene el perfil del usuario autenticado.
 * GET /api/v1/profile -> BFF -> Backend /v1/profile/me
 */
const getProfile = async (): Promise<ProfileResponse> => {
  try {
    const response = await apiClient.get<ProfileResponse>('/api/v1/profile');
    return response.data;
  } catch (error) {
    // Re-lanzar con status para que el componente maneje el error
    const err = error as { response?: { status?: number } };
    const apiError = new Error('Error al obtener el perfil') as Error & {
      status?: number;
    };
    apiError.status = err.response?.status;
    throw apiError;
  }
};

/**
 * Actualiza el perfil del usuario autenticado.
 * PATCH /api/v1/profile -> BFF -> Backend /v1/profile/me
 *
 * @param payload - Datos a actualizar (displayName requerido, bio/avatarUrl opcionales)
 */
const updateProfile = async (
  payload: UpdateProfilePayload,
): Promise<ProfileResponse> => {
  try {
    const response = await apiClient.patch<ProfileResponse>(
      '/api/v1/profile',
      payload,
    );
    return response.data;
  } catch (error) {
    const err = error as { response?: { status?: number } };
    const apiError = new Error('Error al actualizar el perfil') as Error & {
      status?: number;
    };
    apiError.status = err.response?.status;
    throw apiError;
  }
};

export const profileApi = {
  getProfile,
  updateProfile,
};

export { getProfile, updateProfile };