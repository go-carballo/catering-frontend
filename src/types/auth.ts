// Auth types matching backend responses
export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "company_admin" | "supervisor" | "operator";
  companyId: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
