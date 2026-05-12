export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
}

/**
 * Shape of the backend envelope returned by POST /auth/login.
 * Contract: { success, message, data: { accessToken, refreshToken, user } }
 */
export interface BackendAuthResponseData {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
}

export interface BackendAuthResponse {
  success?: boolean;
  message?: string;
  data?: BackendAuthResponseData;
}

export interface LoginResult {
  user: AuthUser | null;
}

export interface RegisterResult {
  user: AuthUser | null;
  hasSession: boolean;
}
