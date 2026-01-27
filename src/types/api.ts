// Generic paginated response
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// API error response
export interface ApiErrorResponse {
  statusCode: number;
  message: string | string[];
  error?: string;
}
