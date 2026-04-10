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

export interface BackendAuthResponse {
  accessToken?: string;
  token?: string;
  user?: AuthUser;
  message?: string;
}

export interface LoginResult {
  user: AuthUser | null;
}

export interface RegisterResult {
  user: AuthUser | null;
  hasSession: boolean;
}
