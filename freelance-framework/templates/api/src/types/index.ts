// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

// Request types
export interface PaginationQuery {
  page?: string;
  pageSize?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Common types
export interface Timestamps {
  createdAt: Date;
  updatedAt: Date;
}

export interface WithId {
  id: string;
}

export type Entity<T> = T & WithId & Timestamps;
