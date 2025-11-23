/**
 * Common API Types
 *
 * Shared types for API requests and responses.
 */

// Generic API response
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

// API error
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string>[];
}

// Paginated response
export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: Pagination;
}

// Pagination info
export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Pagination query params
export interface PaginationQuery {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Filter query
export interface FilterQuery {
  search?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  [key: string]: string | number | boolean | undefined;
}

// Common HTTP methods
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// Request config
export interface RequestConfig {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: unknown;
  timeout?: number;
}

// API endpoints type helper
export type Endpoint<TParams = void, TResponse = unknown> = {
  params: TParams;
  response: TResponse;
};
