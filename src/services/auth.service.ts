import { apiPost, apiGet } from "./api";
import type { LoginRequest, LoginResponse, User } from "@/types/auth";

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiPost<LoginResponse>("/auth/login", credentials);

    // Store token and user
    if (typeof window !== "undefined") {
      localStorage.setItem("token", response.access_token);
      localStorage.setItem("user", JSON.stringify(response.user));
    }

    return response;
  },

  async getProfile(): Promise<User> {
    return apiGet<User>("/auth/profile");
  },

  logout(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
  },

  getStoredUser(): User | null {
    if (typeof window === "undefined") return null;
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  getStoredToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  },

  isAuthenticated(): boolean {
    return !!this.getStoredToken();
  },
};
