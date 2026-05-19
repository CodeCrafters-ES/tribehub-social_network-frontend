// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

import { profileApi, getProfile, updateProfile } from '../profile';
import type { ProfileResponse, UpdateProfilePayload } from '../profile';

describe('Profile API Service', () => {
  const mockProfileData: ProfileResponse = {
    id: '1',
    userId: 'user1',
    displayName: 'Test User',
    bio: 'Test bio',
    avatarUrl: 'https://example.com/avatar.jpg',
    privacy_level: 'public',
  };

  const mockUpdatePayload: UpdateProfilePayload = {
    displayName: 'Updated Name',
    bio: 'Updated bio',
    avatarUrl: 'https://example.com/new-avatar.jpg',
    privacy_level: 'private',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getProfile', () => {
    it('should call /api/v1/profile and return profile data', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockProfileData,
      } as Response);

      const result = await getProfile();

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith('/api/v1/profile', {
        method: 'GET',
        credentials: 'same-origin',
      });
      expect(result).toEqual(mockProfileData);
    });

    it('should throw error with status when response is not ok', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      } as Response);

      await expect(getProfile()).rejects.toThrow();
    });
  });

  describe('updateProfile', () => {
    it('should call /api/v1/profile with PATCH and return updated data', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockProfileData,
      } as Response);

      const result = await updateProfile(mockUpdatePayload);

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith('/api/v1/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockUpdatePayload),
        credentials: 'same-origin',
      });
      expect(result).toEqual(mockProfileData);
    });

    it('should throw error with status when response is not ok', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
      } as Response);

      await expect(updateProfile(mockUpdatePayload)).rejects.toThrow();
    });
  });

  describe('profileApi object', () => {
    it('should have getProfile and updateProfile methods', () => {
      expect(typeof profileApi.getProfile).toBe('function');
      expect(typeof profileApi.updateProfile).toBe('function');
    });

    it('getProfile should delegate to the getProfile function', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockProfileData,
      } as Response);

      const result = await profileApi.getProfile();

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/v1/profile',
        expect.any(Object),
      );
      expect(result).toEqual(mockProfileData);
    });

    it('updateProfile should delegate to the updateProfile function', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockProfileData,
      } as Response);

      const result = await profileApi.updateProfile(mockUpdatePayload);

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/v1/profile',
        expect.any(Object),
      );
      expect(result).toEqual(mockProfileData);
    });
  });
});
