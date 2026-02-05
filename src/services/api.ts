import { env } from "@/config/env";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
}

class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public data?: unknown,
  ) {
    super(`${status}: ${statusText}`);
    this.name = "ApiError";
  }
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("refresh_token");
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    return null;
  }

  try {
    const response = await fetch(`${env.API_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      // Refresh failed, clear tokens and redirect to login
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("company");
        localStorage.removeItem("token_expiry");
        window.location.href = "/login";
      }
      return null;
    }

    const data = await response.json();

    // Update tokens in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("refresh_token", data.refreshToken);

      // Update expiry time
      const expiryTime = Date.now() + data.expiresIn * 1000;
      localStorage.setItem("token_expiry", expiryTime.toString());
    }

    return data.accessToken;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    return null;
  }
}

export async function api<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = "GET", body, headers = {} } = options;
  let token = getToken();

  const config: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const url = `${env.API_URL}${endpoint}`;
  let response = await fetch(url, config);

  // Handle 401 - try to refresh token
  if (response.status === 401) {
    const newToken = await refreshAccessToken();

    if (newToken) {
      // Retry request with new token
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${newToken}`,
      };
      response = await fetch(url, config);
    } else {
      // Refresh failed, redirect to login (already done in refreshAccessToken)
      throw new ApiError(401, "Unauthorized");
    }
  }

  // Handle non-2xx responses
  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new ApiError(response.status, response.statusText, data);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

// Convenience methods
export const apiGet = <T>(endpoint: string) => api<T>(endpoint);

export const apiPost = <T>(endpoint: string, body: unknown) =>
  api<T>(endpoint, { method: "POST", body });

export const apiPut = <T>(endpoint: string, body: unknown) =>
  api<T>(endpoint, { method: "PUT", body });

export const apiPatch = <T>(endpoint: string, body: unknown) =>
  api<T>(endpoint, { method: "PATCH", body });

export const apiDelete = <T>(endpoint: string) =>
  api<T>(endpoint, { method: "DELETE" });

export { ApiError };
