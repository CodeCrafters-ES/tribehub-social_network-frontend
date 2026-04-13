import { profileSchema } from '../schema';

describe('Profile Form Validation Schema', () => {
  describe('displayName validation', () => {
    it('should require at least 2 characters', () => {
      const result = profileSchema.safeParse({
        displayName: 'A', // Too short
        bio: '',
        avatarUrl: '',
        isPublic: true,
      });

      expect(result.success).toBe(false);
    });

    it('should allow exactly 2 characters', () => {
      const result = profileSchema.safeParse({
        displayName: 'AB',
        bio: '',
        avatarUrl: '',
        isPublic: true,
      });

      expect(result.success).toBe(true);
    });

    it('should require at most 50 characters', () => {
      const result = profileSchema.safeParse({
        displayName: 'A'.repeat(51),
        bio: '',
        avatarUrl: '',
        isPublic: true,
      });

      expect(result.success).toBe(false);
    });

    it('should allow exactly 50 characters', () => {
      const result = profileSchema.safeParse({
        displayName: 'A'.repeat(50),
        bio: '',
        avatarUrl: '',
        isPublic: true,
      });

      expect(result.success).toBe(true);
    });

    it('should reject empty displayName', () => {
      const result = profileSchema.safeParse({
        displayName: '',
        bio: '',
        avatarUrl: '',
        isPublic: true,
      });

      expect(result.success).toBe(false);
    });
  });

  describe('bio validation', () => {
    it('should allow empty bio', () => {
      const result = profileSchema.safeParse({
        displayName: 'Test User',
        bio: '',
        avatarUrl: '',
        isPublic: true,
      });

      expect(result.success).toBe(true);
    });

    it('should allow bio within 280 characters', () => {
      const result = profileSchema.safeParse({
        displayName: 'Test User',
        bio: 'A'.repeat(280),
        avatarUrl: '',
        isPublic: true,
      });

      expect(result.success).toBe(true);
    });

    it('should reject bio over 280 characters', () => {
      const result = profileSchema.safeParse({
        displayName: 'Test User',
        bio: 'A'.repeat(281),
        avatarUrl: '',
        isPublic: true,
      });

      expect(result.success).toBe(false);
    });
  });

  describe('avatarUrl validation', () => {
    it('should accept any string for avatarUrl (flexible - backend validates)', () => {
      const result = profileSchema.safeParse({
        displayName: 'Test User',
        bio: '',
        avatarUrl: 'not-a-valid-url', // Backend handles validation
        isPublic: true,
      });

      expect(result.success).toBe(true);
    });

    it('should allow undefined avatarUrl (optional)', () => {
      const result = profileSchema.safeParse({
        displayName: 'Test User',
        bio: '',
        avatarUrl: undefined,
        isPublic: true,
      });

      expect(result.success).toBe(true);
    });
  });

  describe('isPublic validation', () => {
    it('should require boolean value', () => {
      const result = profileSchema.safeParse({
        displayName: 'Test User',
        bio: '',
        avatarUrl: '',
        isPublic: 'true', // String instead of boolean
      });

      expect(result.success).toBe(false);
    });

    it('should allow true', () => {
      const result = profileSchema.safeParse({
        displayName: 'Test User',
        bio: '',
        avatarUrl: '',
        isPublic: true,
      });

      expect(result.success).toBe(true);
    });

    it('should allow false', () => {
      const result = profileSchema.safeParse({
        displayName: 'Test User',
        bio: '',
        avatarUrl: '',
        isPublic: false,
      });

      expect(result.success).toBe(true);
    });
  });

  describe('complete valid profile', () => {
    it('should accept valid profile data', () => {
      const result = profileSchema.safeParse({
        displayName: 'Test User',
        bio: 'This is my bio',
        avatarUrl: 'https://example.com/avatar.jpg',
        isPublic: true,
      });

      expect(result.success).toBe(true);
    });
  });
});
