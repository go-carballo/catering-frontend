"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { authService } from "@/services/auth.service";
import type { Company, LoginRequest, AuthState } from "@/types/auth";

interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    company: null,
    token: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Initialize from localStorage on mount
  useEffect(() => {
    const company = authService.getStoredCompany();
    const token = authService.getStoredToken();
    const refreshToken = authService.getStoredRefreshToken();

    setState({
      company,
      token,
      refreshToken,
      isAuthenticated: !!token,
      isLoading: false,
    });
  }, []);

  const login = useCallback(async (credentials: LoginRequest) => {
    const response = await authService.login(credentials);
    setState({
      company: response.company,
      token: response.accessToken,
      refreshToken: response.refreshToken,
      isAuthenticated: true,
      isLoading: false,
    });
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setState({
      company: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  const refreshTokenFn = useCallback(async () => {
    try {
      const response = await authService.refreshToken();
      setState((prev) => ({
        ...prev,
        token: response.accessToken,
        refreshToken: response.refreshToken,
        isAuthenticated: true,
      }));
    } catch (error) {
      console.error("Token refresh failed:", error);
      // On refresh failure, logout user
      await logout();
    }
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{ ...state, login, logout, refreshAccessToken: refreshTokenFn }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
