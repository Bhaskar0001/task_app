export interface User {
  id: string;
  email: string;
}

export interface AuthState {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface LoginResponse {
  token: string;
  user: User;
}
