// Auth types matching backend responses
export type CompanyType = "CATERING" | "CLIENT";

export interface Company {
  id: string;
  name: string;
  email: string;
  companyType: CompanyType;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  company: Company;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface AuthState {
  company: Company | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
