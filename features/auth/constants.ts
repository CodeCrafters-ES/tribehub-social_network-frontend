export const SESSION_COOKIE_NAME = 'tribehub_session';
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 días

/**
 * httpOnly cookie que almacena el refresh token emitido por el backend.
 * Tiene vida más larga que el access token y nunca se expone al bundle del
 * navegador. El BFF lo lee en POST /api/auth/refresh para rotar el token.
 *
 * IMPORTANTE: el nombre debe coincidir con lo que el BFF /api/auth/refresh
 * lee en las cookies del request entrante. El backend NestJS espera la cookie
 * con nombre 'refresh_token' — el BFF la extrae de 'tribehub_refresh' y la
 * reenvía con el nombre correcto al backend.
 */
export const REFRESH_TOKEN_COOKIE_NAME = 'tribehub_refresh';
export const REFRESH_TOKEN_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 días
