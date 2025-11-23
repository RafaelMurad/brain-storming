/**
 * Common Types
 *
 * Shared types used across projects.
 */

// Entity with timestamps
export interface Timestamps {
  createdAt: Date | string;
  updatedAt: Date | string;
}

// Entity with ID
export interface WithId {
  id: string;
}

// Full entity type
export type Entity<T> = T & WithId & Timestamps;

// Nullable type
export type Nullable<T> = T | null;

// Optional type
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Make all properties required
export type Required<T> = {
  [P in keyof T]-?: T[P];
};

// Make all properties readonly
export type Immutable<T> = {
  readonly [P in keyof T]: T[P];
};

// Deep partial
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Record with string keys
export type StringRecord<T> = Record<string, T>;

// Async function type
export type AsyncFunction<T = void> = () => Promise<T>;

// Event handler type
export type EventHandler<T = void> = (event: T) => void;

// Common status enum
export type Status = 'idle' | 'loading' | 'success' | 'error';

// Theme type
export type Theme = 'light' | 'dark' | 'system';

// Sort direction
export type SortDirection = 'asc' | 'desc';

// Result type (for error handling)
export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

// Loading state
export interface LoadingState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

// Form field
export interface FormField<T = string> {
  value: T;
  error?: string;
  touched: boolean;
}

// Select option
export interface SelectOption<T = string> {
  label: string;
  value: T;
  disabled?: boolean;
}

// Key-value pair
export interface KeyValue<K = string, V = string> {
  key: K;
  value: V;
}

// Coordinates
export interface Coordinates {
  latitude: number;
  longitude: number;
}

// Dimensions
export interface Dimensions {
  width: number;
  height: number;
}

// Range
export interface Range<T = number> {
  min: T;
  max: T;
}

// Date range
export interface DateRange {
  start: Date | string;
  end: Date | string;
}
