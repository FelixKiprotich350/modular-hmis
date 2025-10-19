export interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    roles: string[];
  };
}

export interface AuthContext {
  ip?: string;
  userAgent?: string;
}