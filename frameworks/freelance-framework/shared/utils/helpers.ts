/**
 * General utility functions
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes (clsx + tailwind-merge)
 *
 * @example
 * cn('px-4 py-2', 'px-6') // 'py-2 px-6'
 * cn('text-red-500', isActive && 'text-blue-500')
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Sleep/delay for a given duration
 *
 * @param ms - Duration in milliseconds
 *
 * @example
 * await sleep(1000); // Wait 1 second
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Generate a random ID
 *
 * @param length - Length of the ID (default: 7)
 *
 * @example
 * generateId() // 'a1b2c3d'
 */
export function generateId(length: number = 7): string {
  return Math.random()
    .toString(36)
    .substring(2, 2 + length);
}

/**
 * Generate a UUID v4
 *
 * @example
 * generateUUID() // '123e4567-e89b-12d3-a456-426614174000'
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Debounce a function
 *
 * @param fn - The function to debounce
 * @param delay - Delay in milliseconds
 *
 * @example
 * const debouncedSearch = debounce(search, 300);
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Throttle a function
 *
 * @param fn - The function to throttle
 * @param limit - Time limit in milliseconds
 *
 * @example
 * const throttledScroll = throttle(handleScroll, 100);
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Deep clone an object
 *
 * @param obj - The object to clone
 *
 * @example
 * const copy = deepClone(original);
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Check if a value is empty (null, undefined, empty string, empty array, empty object)
 *
 * @param value - The value to check
 *
 * @example
 * isEmpty(null) // true
 * isEmpty([]) // true
 * isEmpty({}) // true
 * isEmpty('') // true
 */
export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 * Clamp a number between min and max
 *
 * @param value - The value to clamp
 * @param min - Minimum value
 * @param max - Maximum value
 *
 * @example
 * clamp(5, 0, 10) // 5
 * clamp(-5, 0, 10) // 0
 * clamp(15, 0, 10) // 10
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Linear interpolation
 *
 * @param start - Start value
 * @param end - End value
 * @param t - Interpolation factor (0-1)
 *
 * @example
 * lerp(0, 100, 0.5) // 50
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

/**
 * Get a random item from an array
 *
 * @param array - The array to pick from
 *
 * @example
 * randomItem(['a', 'b', 'c']) // 'b'
 */
export function randomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Shuffle an array (Fisher-Yates algorithm)
 *
 * @param array - The array to shuffle
 *
 * @example
 * shuffle([1, 2, 3, 4, 5]) // [3, 1, 5, 2, 4]
 */
export function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Group an array by a key
 *
 * @param array - The array to group
 * @param key - The key to group by
 *
 * @example
 * groupBy([{type: 'a'}, {type: 'b'}, {type: 'a'}], 'type')
 * // { a: [{type: 'a'}, {type: 'a'}], b: [{type: 'b'}] }
 */
export function groupBy<T extends Record<string, unknown>>(
  array: T[],
  key: keyof T
): Record<string, T[]> {
  return array.reduce(
    (result, item) => {
      const groupKey = String(item[key]);
      if (!result[groupKey]) {
        result[groupKey] = [];
      }
      result[groupKey].push(item);
      return result;
    },
    {} as Record<string, T[]>
  );
}

/**
 * Remove duplicates from an array
 *
 * @param array - The array to dedupe
 * @param key - Optional key for object arrays
 *
 * @example
 * unique([1, 2, 2, 3]) // [1, 2, 3]
 * unique([{id: 1}, {id: 1}, {id: 2}], 'id') // [{id: 1}, {id: 2}]
 */
export function unique<T>(array: T[], key?: keyof T): T[] {
  if (key) {
    const seen = new Set();
    return array.filter((item) => {
      const k = item[key];
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
  }
  return [...new Set(array)];
}
