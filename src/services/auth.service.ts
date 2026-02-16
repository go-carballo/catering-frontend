import { env } from "@/config/env";
import type {
  LoginRequest,
  LoginResponse,
  Company,
} from "@/types/auth";

const TOKEN_KEY = "token";
const REFRESH_TOKEN_KEY = "refresh_token";
const COMPANY_KEY = "company";
const TOKEN_EXPIRY_KEY = "token_expiry";

// ── Mutex for token refresh ─────────────────────────────────────────
// Prevents concurrent 401 responses from triggering multiple refresh
// calls. All callers await the same in-flight promise.
let refreshPromise: Promise<string | null> | null = null;

const SESSION_COOKIE = "auth-session";

function isClient(): boolean {
  return typeof window !== "undefined";
}

/**
 * Set a lightweight cookie so the Next.js edge middleware can
 * detect whether a session exists (without accessing localStorage).
 * The cookie has NO sensitive data — it's just a flag.
 */
function setSessionCookie(): void {
  if (!isClient()) return;
  // Set cookie for 7 days — SameSite=Lax for CSRF protection
  document.cookie = `${SESSION_COOKIE}=1; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
}

function clearSessionCookie(): void {
  if (!isClient()) return;
  document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}

export const authService = {
  // ── Token storage (single source of truth) ──────────────────────

  getStoredToken(): string | null {
    if (!isClient()) return null;
    return localStorage.getItem(TOKEN_KEY);
  },

  getStoredRefreshToken(): string | null {
    if (!isClient()) return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  getStoredCompany(): Company | null {
    if (!isClient()) return null;
    const company = localStorage.getItem(COMPANY_KEY);
    return company ? JSON.parse(company) : null;
  },

  isTokenExpired(): boolean {
    if (!isClient()) return true;
    const expiryTime = localStorage.getItem(TOKEN_EXPIRY_KEY);
    if (!expiryTime) return true;

    const expiryMs = parseInt(expiryTime, 10);
    // Consider token expired if less than 1 minute left
    return Date.now() > expiryMs - 60 * 1000;
  },

  isAuthenticated(): boolean {
    return !!this.getStoredToken() && !this.isTokenExpired();
  },

  /** Store tokens + company after login or refresh */
  storeTokens(response: LoginResponse): void {
    if (!isClient()) return;

    localStorage.setItem(TOKEN_KEY, response.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);
    localStorage.setItem(COMPANY_KEY, JSON.stringify(response.company));

    const expiryTime = Date.now() + response.expiresIn * 1000;
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());

    setSessionCookie();
  },

  /** Update only access/refresh tokens (no company change on refresh) */
  storeRefreshedTokens(data: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  }): void {
    if (!isClient()) return;

    localStorage.setItem(TOKEN_KEY, data.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);

    const expiryTime = Date.now() + data.expiresIn * 1000;
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());

    setSessionCookie(); // Renew cookie TTL on refresh
  },

  clearTokens(): void {
    if (!isClient()) return;

    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(COMPANY_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);

    clearSessionCookie();
  },

  // ── Auth operations ─────────────────────────────────────────────

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    // Use raw fetch — NOT apiPost — to avoid circular dependency
    // with the 401 interceptor (login should never trigger a refresh)
    const response = await fetch(`${env.API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      throw new Error(
        data?.message || `Login failed: ${response.statusText}`,
      );
    }

    const data: LoginResponse = await response.json();
    this.storeTokens(data);
    return data;
  },

  /**
   * Refresh the access token.
   *
   * Uses a mutex so concurrent 401 responses all await the same
   * in-flight refresh rather than hammering the endpoint.
   * Uses raw fetch to avoid re-entering the api() interceptor.
   */
  async refreshToken(): Promise<string | null> {
    // If a refresh is already in-flight, piggyback on it
    if (refreshPromise) return refreshPromise;

    refreshPromise = this.executeRefresh();

    try {
      return await refreshPromise;
    } finally {
      refreshPromise = null;
    }
  },

  /** @internal — do not call directly, use refreshToken() */
  async executeRefresh(): Promise<string | null> {
    const storedRefreshToken = this.getStoredRefreshToken();
    if (!storedRefreshToken) return null;

    try {
      const response = await fetch(`${env.API_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: storedRefreshToken }),
      });

      if (!response.ok) {
        this.clearTokens();
        return null;
      }

      const data = await response.json();
      this.storeRefreshedTokens(data);
      return data.accessToken;
    } catch {
      this.clearTokens();
      return null;
    }
  },

  async logout(): Promise<void> {
    const storedRefreshToken = this.getStoredRefreshToken();

    // Try to revoke on backend (best-effort, don't block on failure)
    if (storedRefreshToken) {
      try {
        await fetch(`${env.API_URL}/auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.getStoredToken()}`,
          },
          body: JSON.stringify({ refreshToken: storedRefreshToken }),
        });
      } catch {
        // Swallow — we're logging out anyway
      }
    }

    this.clearTokens();
  },
};
