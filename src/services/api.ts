import { authService } from "@/services/auth.service";
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

export async function api<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = "GET", body, headers = {} } = options;
  let token = authService.getStoredToken();

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

  // Handle 401 — delegate refresh to authService (with mutex)
  if (response.status === 401) {
    const newToken = await authService.refreshToken();

    if (newToken) {
      // Retry request with new token
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${newToken}`,
      };
      response = await fetch(url, config);
    } else {
      // Refresh failed — tokens already cleared by authService
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
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
