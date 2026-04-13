import { z } from 'zod';

// Extract the validation schema from the page component
const profileSchema = z.object({
  displayName: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres.')
    .max(50, 'El nombre no debe exceder los 50 caracteres.'),
  bio: z
    .string()
    .max(280, 'La biografía no debe exceder los 280 caracteres.')
    .optional(),
  avatarUrl: z
    .string()
    .url('Ingresa una URL válida para el avatar')
    .optional()
    .or(z.literal('')),
  isPublic: z.boolean(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

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
        displayName: 'Ab',
        bio: '',
        avatarUrl: '',
        isPublic: true,
      });

      expect(result.success).toBe(true);
    });

    it('should allow up to 50 characters', () => {
      const result = profileSchema.safeParse({
        displayName: 'a'.repeat(50),
        bio: '',
        avatarUrl: '',
        isPublic: true,
      });

      expect(result.success).toBe(true);
    });

    it('should reject more than 50 characters', () => {
      const result = profileSchema.safeParse({
        displayName: 'a'.repeat(51), // Too long
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

    it('should allow up to 280 characters', () => {
      const result = profileSchema.safeParse({
        displayName: 'Test User',
        bio: 'a'.repeat(280),
        avatarUrl: '',
        isPublic: true,
      });

      expect(result.success).toBe(true);
    });

    it('should reject more than 280 characters', () => {
      const result = profileSchema.safeParse({
        displayName: 'Test User',
        bio: 'a'.repeat(281), // Too long
        avatarUrl: '',
        isPublic: true,
      });

      expect(result.success).toBe(false);
    });

    it('should allow undefined bio (optional)', () => {
      const result = profileSchema.safeParse({
        displayName: 'Test User',
        bio: undefined,
        avatarUrl: '',
        isPublic: true,
      });

      expect(result.success).toBe(true);
    });
  });

  describe('avatarUrl validation', () => {
    it('should allow empty string', () => {
      const result = profileSchema.safeParse({
        displayName: 'Test User',
        bio: '',
        avatarUrl: '',
        isPublic: true,
      });

      expect(result.success).toBe(true);
    });

    it('should allow valid URL', () => {
      const result = profileSchema.safeParse({
        displayName: 'Test User',
        bio: '',
        avatarUrl: 'https://example.com/avatar.jpg',
        isPublic: true,
      });

      expect(result.success).toBe(true);
    });

    it('should reject invalid URL', () => {
      const result = profileSchema.safeParse({
        displayName: 'Test User',
        bio: '',
        avatarUrl: 'not-a-valid-url',
        isPublic: true,
      });

      expect(result.success).toBe(false);
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
      // Test with true
      let result = profileSchema.safeParse({
        displayName: 'Test User',
        bio: '',
        avatarUrl: '',
        isPublic: true,
      });

      expect(result.success).toBe(true);

      // Test with false
      result = profileSchema.safeParse({
        displayName: 'Test User',
        bio: '',
        avatarUrl: '',
        isPublic: false,
      });

      expect(result.success).toBe(true);
    });

    it('should reject non-boolean values', () => {
      const result = profileSchema.safeParse({
        displayName: 'Test User',
        bio: '',
        avatarUrl: '',
        // @ts-ignore - intentionally testing invalid type
        isPublic: 'yes',
      });

      expect(result.success).toBe(false);
    });
  });

  describe('valid complete form', () => {
    it('should accept valid form data', () => {
      const validData: ProfileFormValues = {
        displayName: 'Juan Pérez',
        bio: 'Desarrollador de software apasionado por crear experiencias digitales increíbles.',
        avatarUrl: 'https://example.com/avatar.jpg',
        isPublic: true,
      };

      const result = profileSchema.safeParse(validData);

      expect(result.success).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle special characters in displayName', () => {
      const result = profileSchema.safeParse({
        displayName: 'Juan Pérez & María López',
        bio: '',
        avatarUrl: '',
        isPublic: true,
      });

      expect(result.success).toBe(true);
    });

    it('should handle emojis in bio', () => {
      const result = profileSchema.safeParse({
        displayName: 'Test User',
        bio: 'Desarrollador 🚀 | Amante del café ☕',
        avatarUrl: '',
        isPublic: true,
      });

      expect(result.success).toBe(true);
    });
  });
});
