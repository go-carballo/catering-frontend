import { apiPost, apiGet } from "./api";
import type {
  LoginRequest,
  LoginResponse,
  Company,
  RefreshTokenRequest,
} from "@/types/auth";

const TOKEN_KEY = "token";
const REFRESH_TOKEN_KEY = "refresh_token";
const COMPANY_KEY = "company";
const TOKEN_EXPIRY_KEY = "token_expiry";

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiPost<LoginResponse>("/auth/login", credentials);

    // Store token, refresh token, and company
    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_KEY, response.accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);
      localStorage.setItem(COMPANY_KEY, JSON.stringify(response.company));

      // Store expiry time: now + expiresIn (in milliseconds)
      const expiryTime = Date.now() + response.expiresIn * 1000;
      localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
    }

    return response;
  },

  async refreshToken(): Promise<LoginResponse> {
    const refreshToken = this.getStoredRefreshToken();
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await apiPost<LoginResponse>("/auth/refresh", {
      refreshToken,
    });

    // Update stored tokens
    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_KEY, response.accessToken);
      // refreshToken might be the same or new, update it
      localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);

      // Update expiry time
      const expiryTime = Date.now() + response.expiresIn * 1000;
      localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
    }

    return response;
  },

  async logout(): Promise<void> {
    const refreshToken = this.getStoredRefreshToken();

    // Try to revoke on backend
    if (refreshToken) {
      try {
        await apiPost("/auth/logout", {
          refreshToken,
        });
      } catch (error) {
        // Even if backend logout fails, clear local storage
        console.error("Backend logout failed:", error);
      }
    }

    // Clear local storage
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(COMPANY_KEY);
      localStorage.removeItem(TOKEN_EXPIRY_KEY);
      window.location.href = "/login";
    }
  },

  getStoredCompany(): Company | null {
    if (typeof window === "undefined") return null;
    const company = localStorage.getItem(COMPANY_KEY);
    return company ? JSON.parse(company) : null;
  },

  getStoredToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
  },

  getStoredRefreshToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  isTokenExpired(): boolean {
    if (typeof window === "undefined") return true;
    const expiryTime = localStorage.getItem(TOKEN_EXPIRY_KEY);
    if (!expiryTime) return true;

    const expiryMs = parseInt(expiryTime, 10);
    // Consider token expired if less than 1 minute left
    return Date.now() > expiryMs - 60 * 1000;
  },

  isAuthenticated(): boolean {
    return !!this.getStoredToken() && !this.isTokenExpired();
  },
};
