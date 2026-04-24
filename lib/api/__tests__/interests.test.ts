import {
  listInterests,
  listCategories,
  getMyInterests,
  setMyInterests,
} from '../interests';
import {
  MOCK_INTERESTS,
  MOCK_CATEGORIES,
  MOCK_SELECTED,
} from '../../mocks/interests';
import type { Interest, Category } from '../../types/interests';

global.fetch = jest.fn();

describe('interests API', () => {
  describe('1. When USE_MOCK true', () => {
    beforeEach(() => {
      process.env.NEXT_PUBLIC_USE_MOCK = 'true';

      MOCK_SELECTED.length = 0;
      MOCK_SELECTED.push('3', '5');
    });

    it('1.1 listInterests should return all interests', async () => {
      const result = await listInterests();
      expect(result).toEqual(MOCK_INTERESTS);
    });

    it('1.2 listInterests should filter interests by category', async () => {
      const result = await listInterests('arte_cultura');
      expect(result).toEqual(
        MOCK_INTERESTS.filter((i) => i.category === 'arte_cultura'),
      );
    });

    it('1.3 listCategories should return categories', async () => {
      const result = await listCategories();
      expect(result).toEqual(MOCK_CATEGORIES);
    });

    it('1.4 getMyInterests should return selected interests', async () => {
      const result = await getMyInterests();
      expect(result).toEqual(MOCK_SELECTED);
    });

    it('1.5 setMyInterests should update mock selected interests', async () => {
      const newInterests = ['1', '2', '4'];
      await setMyInterests(newInterests);
      expect(MOCK_SELECTED).toEqual(newInterests);
    });
  });

  describe('2. When USE_MOCK is false', () => {
    let listInterests: (category?: string) => Promise<Interest[]>;
    let listCategories: () => Promise<Category[]>;
    let getMyInterests: () => Promise<string[]>;
    let setMyInterests: (interestIds: string[]) => Promise<void>;

    beforeEach(async () => {
      process.env.NEXT_PUBLIC_USE_MOCK = 'false';
      process.env.NEXT_PUBLIC_API_BASE_URL = 'http://api.example.com';
      jest.resetModules();
      const mod = await import('../interests');
      listInterests = mod.listInterests;
      listCategories = mod.listCategories;
      getMyInterests = mod.getMyInterests;
      setMyInterests = mod.setMyInterests;
      (global.fetch as jest.Mock).mockClear();
    });

    it('2.1 listInterests should fetch interests from API', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(MOCK_INTERESTS),
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await listInterests();

      expect(global.fetch).toHaveBeenCalledWith(
        'http://api.example.com/interests',
        { credentials: 'include' },
      );
      expect(result).toEqual(MOCK_INTERESTS);
    });

    it('2.2 listInterests should fetch filtered interests from API when category provided', async () => {
      const mockResponse = { ok: true, json: jest.fn().mockResolvedValue([]) };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      await listInterests('arte_cultura');

      expect(global.fetch).toHaveBeenCalledWith(
        'http://api.example.com/interests?category=arte_cultura',
        { credentials: 'include' },
      );
    });

    it('2.3 listInterests should throw error when API call fails', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({ ok: false });

      await expect(listInterests()).rejects.toThrow('Error fetching interests');
    });

    it('2.4 listCategories should fetch categories from API', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(MOCK_CATEGORIES),
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await listCategories();

      expect(global.fetch).toHaveBeenCalledWith(
        'http://api.example.com/categories',
        { credentials: 'include' },
      );
      expect(result).toEqual(MOCK_CATEGORIES);
    });

    it('2.5 listCategories should throw error when API call fails', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({ ok: false });

      await expect(listCategories()).rejects.toThrow(
        'Error fetching categories',
      );
    });

    it('2.6 getMyInterests should fetch user interests from API', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(['1', '2']),
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await getMyInterests();

      expect(global.fetch).toHaveBeenCalledWith(
        'http://api.example.com/users/me/interests',
        { credentials: 'include' },
      );
      expect(result).toEqual(['1', '2']);
    });

    it('2.7 getMyInterests should throw error when API call fails', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({ ok: false });

      await expect(getMyInterests()).rejects.toThrow(
        'Error fetching my interests',
      );
    });

    it('2.8 setMyInterests should send PUT request to API', async () => {
      const mockResponse = { ok: true, text: jest.fn().mockResolvedValue('') };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);
      const newInterests = ['1', '2', '4'];

      await setMyInterests(newInterests);

      expect(global.fetch).toHaveBeenCalledWith(
        'http://api.example.com/users/me/interests',
        {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ interestIds: newInterests }),
        },
      );
    });

    it('2.9 setMyInterests should throw error when API call fails', async () => {
      const mockResponse = {
        ok: false,
        text: jest.fn().mockResolvedValue('Server error'),
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      await expect(setMyInterests(['1'])).rejects.toThrow(
        'Error saving interests: Server error',
      );
    });
  });
});
