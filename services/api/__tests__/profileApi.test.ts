// jest.mock paths must resolve at hoist time — use paths relative to this file.
jest.mock('../apiClient', () => ({
  apiClient: {
    get: jest.fn(),
    patch: jest.fn(),
  },
}));

// Import after mock registration so the tests pick up the mocked module.
import { apiClient } from '../apiClient';
import { profileApi, getProfile, updateProfile } from '../profile';
import type { ProfileResponse, UpdateProfilePayload } from '../profile';

describe('Profile API Service', () => {
  const mockProfileData: ProfileResponse = {
    id: '1',
    userId: 'user1',
    displayName: 'Test User',
    bio: 'Test bio',
    avatarUrl: 'https://example.com/avatar.jpg',
    isPublic: true,
  };

  const mockUpdatePayload: UpdateProfilePayload = {
    displayName: 'Updated Name',
    bio: 'Updated bio',
    avatarUrl: 'https://example.com/new-avatar.jpg',
    isPublic: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getProfile', () => {
    it('should call apiClient.get with correct endpoint and return profile data', async () => {
      (apiClient.get as jest.Mock).mockResolvedValueOnce({
        data: mockProfileData,
      });

      const result = await getProfile();

      expect(apiClient.get).toHaveBeenCalledTimes(1);
      expect(apiClient.get).toHaveBeenCalledWith('/v1/profile/me');
      expect(result).toEqual(mockProfileData);
    });

    it('should handle apiClient.get errors', async () => {
      const mockError = new Error('API Error');
      (apiClient.get as jest.Mock).mockRejectedValueOnce(mockError);

      await expect(getProfile()).rejects.toThrow(mockError);
    });
  });

  describe('updateProfile', () => {
    it('should call apiClient.patch with correct endpoint and payload', async () => {
      (apiClient.patch as jest.Mock).mockResolvedValueOnce({
        data: mockProfileData,
      });

      const result = await updateProfile(mockUpdatePayload);

      expect(apiClient.patch).toHaveBeenCalledTimes(1);
      expect(apiClient.patch).toHaveBeenCalledWith(
        '/v1/profile/me',
        mockUpdatePayload,
      );
      expect(result).toEqual(mockProfileData);
    });

    it('should handle apiClient.patch errors', async () => {
      const mockError = new Error('API Error');
      (apiClient.patch as jest.Mock).mockRejectedValueOnce(mockError);

      await expect(updateProfile(mockUpdatePayload)).rejects.toThrow(mockError);
    });
  });

  describe('profileApi object', () => {
    it('should have getProfile and updateProfile methods', () => {
      expect(typeof profileApi.getProfile).toBe('function');
      expect(typeof profileApi.updateProfile).toBe('function');
    });

    it('getProfile should delegate to the getProfile function', async () => {
      (apiClient.get as jest.Mock).mockResolvedValueOnce({
        data: mockProfileData,
      });

      const result = await profileApi.getProfile();

      expect(apiClient.get).toHaveBeenCalledWith('/v1/profile/me');
      expect(result).toEqual(mockProfileData);
    });

    it('updateProfile should delegate to the updateProfile function', async () => {
      (apiClient.patch as jest.Mock).mockResolvedValueOnce({
        data: mockProfileData,
      });

      const result = await profileApi.updateProfile(mockUpdatePayload);

      expect(apiClient.patch).toHaveBeenCalledWith(
        '/v1/profile/me',
        mockUpdatePayload,
      );
      expect(result).toEqual(mockProfileData);
    });
  });
});
