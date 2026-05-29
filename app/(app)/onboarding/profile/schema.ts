/**
 * Profile form validation schema
 * Import this in both the component and tests for consistency
 *
 * IMPORTANT: Must match backend DTO (src/modules/profile/dto/update-profile.dto.ts)
 * - displayName: 2-50 chars (required)
 * - bio: max 160 chars (optional)
 * - avatarUrl: valid URL or empty (optional)
 * - isPublic: NOT in backend DTO, removed from here
 */
import { z } from 'zod';

export const profileSchema = z.object({
  displayName: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres.')
    .max(50, 'El nombre no debe exceder los 50 caracteres.'),
  bio: z
    .string()
    .max(160, 'La biografía no debe exceder los 160 caracteres.')
    .optional()
    .or(z.literal('')),
  avatarUrl: z
    .string()
    .url('Debe ser una URL válida')
    .optional()
    .or(z.literal('')),
  // isPublic removed: not in backend DTO, would cause 400 with forbidNonWhitelisted
});

export type ProfileFormValues = z.infer<typeof profileSchema>;