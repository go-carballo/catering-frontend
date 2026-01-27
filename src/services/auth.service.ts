import { apiPost, apiGet } from "./api";
import type { LoginRequest, LoginResponse, Company } from "@/types/auth";

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiPost<LoginResponse>("/auth/login", credentials);

    // Store token and company
    if (typeof window !== "undefined") {
      localStorage.setItem("token", response.accessToken);
      localStorage.setItem("company", JSON.stringify(response.company));
    }

    return response;
  },

  logout(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("company");
      window.location.href = "/login";
    }
  },

  getStoredCompany(): Company | null {
    if (typeof window === "undefined") return null;
    const company = localStorage.getItem("company");
    return company ? JSON.parse(company) : null;
  },

  getStoredToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  },

  isAuthenticated(): boolean {
    return !!this.getStoredToken();
  },
};
