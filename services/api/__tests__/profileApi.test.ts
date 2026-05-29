/**
 * Tests del servicio de API de perfil.
 *
 * IMPORTANTE: El servicio ahora usa Axios (apiClient) en lugar de fetch nativo.
 * Esto permite que los interceptores de refresh token funcionen correctamente.
 */

// Mock del apiClient de Axios
const mockAxiosGet = jest.fn();
const mockAxiosPatch = jest.fn();

jest.mock('../apiClient', () => ({
  apiClient: {
    get: (...args: unknown[]) => mockAxiosGet(...args),
    patch: (...args: unknown[]) => mockAxiosPatch(...args),
  },
}));

import { profileApi, getProfile, updateProfile } from '../profile';
import type { ProfileResponse, UpdateProfilePayload } from '@/features/profile/types';

describe('Profile API Service', () => {
  const mockProfileData: ProfileResponse = {
    id: '1',
    userId: 'user1',
    displayName: 'Test User',
    bio: 'Test bio',
    avatarUrl: 'https://example.com/avatar.jpg',
  };

  const mockUpdatePayload: UpdateProfilePayload = {
    displayName: 'Updated Name',
    bio: 'Updated bio',
    avatarUrl: 'https://example.com/new-avatar.jpg',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getProfile', () => {
    it('debe llamar a /profile y retornar los datos del perfil', async () => {
      mockAxiosGet.mockResolvedValueOnce({ data: mockProfileData });

      const result = await getProfile();

      expect(mockAxiosGet).toHaveBeenCalledTimes(1);
      expect(mockAxiosGet).toHaveBeenCalledWith('/profile');
      expect(result).toEqual(mockProfileData);
    });

    it('debe lanzar error con status cuando la respuesta no es exitosa', async () => {
      mockAxiosGet.mockRejectedValueOnce({
        response: { status: 500 },
      });

      await expect(getProfile()).rejects.toThrow();
    });
  });

  describe('updateProfile', () => {
    it('debe llamar a /profile con PATCH y retornar los datos actualizados', async () => {
      mockAxiosPatch.mockResolvedValueOnce({ data: mockProfileData });

      const result = await updateProfile(mockUpdatePayload);

      expect(mockAxiosPatch).toHaveBeenCalledTimes(1);
      expect(mockAxiosPatch).toHaveBeenCalledWith(
        '/profile',
        mockUpdatePayload,
      );
      expect(result).toEqual(mockProfileData);
    });

    it('debe lanzar error con status cuando la respuesta no es exitosa', async () => {
      mockAxiosPatch.mockRejectedValueOnce({
        response: { status: 400 },
      });

      await expect(updateProfile(mockUpdatePayload)).rejects.toThrow();
    });
  });

  describe('profileApi object', () => {
    it('debe tener los métodos getProfile y updateProfile', () => {
      expect(typeof profileApi.getProfile).toBe('function');
      expect(typeof profileApi.updateProfile).toBe('function');
    });

    it('getProfile debe delegar a la función getProfile', async () => {
      mockAxiosGet.mockResolvedValueOnce({ data: mockProfileData });

      const result = await profileApi.getProfile();

      expect(mockAxiosGet).toHaveBeenCalledWith('/profile');
      expect(result).toEqual(mockProfileData);
    });

    it('updateProfile debe delegar a la función updateProfile', async () => {
      mockAxiosPatch.mockResolvedValueOnce({ data: mockProfileData });

      const result = await profileApi.updateProfile(mockUpdatePayload);

      expect(mockAxiosPatch).toHaveBeenCalledWith(
        '/profile',
        mockUpdatePayload,
      );
      expect(result).toEqual(mockProfileData);
    });
  });
});