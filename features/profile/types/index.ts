/**
 * Tipos de dominio para el módulo de perfil.
 *
 * IMPORTANTE: Deben coincidir con el DTO del backend
 * (src/modules/profile/dto/update-profile.dto.ts)
 *
 * - displayName: requerido, 2-50 caracteres
 * - bio: opcional, máximo 160 caracteres
 * - avatarUrl: opcional, debe ser URL válida
 */

export interface ProfileResponse {
  id: string;
  userId: string;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
}

export interface UpdateProfilePayload {
  displayName: string;
  bio?: string;
  avatarUrl?: string;
}