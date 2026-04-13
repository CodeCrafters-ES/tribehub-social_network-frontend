/**
 * Profile form validation schema
 * Import this in both the component and tests for consistency
 */
import { z } from 'zod';

export const profileSchema = z.object({
  displayName: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres.')
    .max(50, 'El nombre no debe exceder los 50 caracteres.'),
  bio: z
    .string()
    .max(280, 'La biografía no debe exceder los 280 caracteres.')
    .optional(),
  avatarUrl: z.string().optional(),
  isPublic: z.boolean(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
