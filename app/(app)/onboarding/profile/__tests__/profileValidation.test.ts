import { profileSchema } from '../schema';

/**
 * Tests must match backend DTO validation.
 * Key changes from original:
 * - bio: max 160 chars (was 280)
 * - avatarUrl: must be valid URL (was flexible string)
 * - isPublic: removed (not in backend DTO)
 */

describe('Profile Form Validation Schema', () => {
  describe('displayName validation', () => {
    it('should require at least 2 characters', () => {
      const result = profileSchema.safeParse({
        displayName: 'A', // Too short
      });

      expect(result.success).toBe(false);
    });

    it('should allow exactly 2 characters', () => {
      const result = profileSchema.safeParse({
        displayName: 'AB',
      });

      expect(result.success).toBe(true);
    });

    it('should require at most 50 characters', () => {
      const result = profileSchema.safeParse({
        displayName: 'A'.repeat(51),
      });

      expect(result.success).toBe(false);
    });

    it('should allow exactly 50 characters', () => {
      const result = profileSchema.safeParse({
        displayName: 'A'.repeat(50),
      });

      expect(result.success).toBe(true);
    });

    it('should reject empty displayName', () => {
      const result = profileSchema.safeParse({
        displayName: '',
      });

      expect(result.success).toBe(false);
    });
  });

  describe('bio validation', () => {
    it('should allow empty bio', () => {
      const result = profileSchema.safeParse({
        displayName: 'Test User',
        bio: '',
      });

      expect(result.success).toBe(true);
    });

    it('should allow undefined bio', () => {
      const result = profileSchema.safeParse({
        displayName: 'Test User',
        bio: undefined,
      });

      expect(result.success).toBe(true);
    });

    it('should allow bio within 160 characters', () => {
      const result = profileSchema.safeParse({
        displayName: 'Test User',
        bio: 'A'.repeat(160),
      });

      expect(result.success).toBe(true);
    });

    it('should reject bio over 160 characters', () => {
      const result = profileSchema.safeParse({
        displayName: 'Test User',
        bio: 'A'.repeat(161),
      });

      expect(result.success).toBe(false);
    });
  });

  describe('avatarUrl validation', () => {
    it('should allow valid URL', () => {
      const result = profileSchema.safeParse({
        displayName: 'Test User',
        avatarUrl: 'https://example.com/avatar.jpg',
      });

      expect(result.success).toBe(true);
    });

    it('should allow undefined avatarUrl (optional)', () => {
      const result = profileSchema.safeParse({
        displayName: 'Test User',
        avatarUrl: undefined,
      });

      expect(result.success).toBe(true);
    });

    it('should allow empty avatarUrl', () => {
      const result = profileSchema.safeParse({
        displayName: 'Test User',
        avatarUrl: '',
      });

      expect(result.success).toBe(true);
    });

    it('should reject invalid URL', () => {
      const result = profileSchema.safeParse({
        displayName: 'Test User',
        avatarUrl: 'not-a-valid-url',
      });

      expect(result.success).toBe(false);
    });
  });

  describe('complete valid profile', () => {
    it('should accept valid profile data', () => {
      const result = profileSchema.safeParse({
        displayName: 'Test User',
        bio: 'This is my bio',
        avatarUrl: 'https://example.com/avatar.jpg',
      });

      expect(result.success).toBe(true);
    });

    it('should accept profile with only required fields', () => {
      const result = profileSchema.safeParse({
        displayName: 'Test User',
      });

      expect(result.success).toBe(true);
    });
  });
});