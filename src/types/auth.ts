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
  company: Company;
}

export interface AuthState {
  company: Company | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
