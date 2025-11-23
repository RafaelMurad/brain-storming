/**
 * Formatting utilities
 */

/**
 * Format a number as currency
 *
 * @param amount - The numeric amount
 * @param currency - ISO 4217 currency code (default: USD)
 * @param locale - Locale string (default: en-US)
 *
 * @example
 * formatCurrency(1234.56) // '$1,234.56'
 * formatCurrency(1234.56, 'EUR', 'de-DE') // '1.234,56 €'
 */
export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Format a date
 *
 * @param date - Date object or string
 * @param options - Intl.DateTimeFormatOptions
 * @param locale - Locale string (default: en-US)
 *
 * @example
 * formatDate(new Date()) // 'Jan 15, 2024'
 * formatDate(new Date(), { dateStyle: 'full' }) // 'Monday, January 15, 2024'
 */
export function formatDate(
  date: Date | string,
  options: Intl.DateTimeFormatOptions = { dateStyle: 'medium' },
  locale: string = 'en-US'
): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, options).format(d);
}

/**
 * Format relative time
 *
 * @param date - Date object or string
 * @param locale - Locale string (default: en-US)
 *
 * @example
 * formatRelativeTime(new Date(Date.now() - 60000)) // '1 minute ago'
 */
export function formatRelativeTime(
  date: Date | string,
  locale: string = 'en-US'
): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  if (diffInSeconds < 60) {
    return rtf.format(-diffInSeconds, 'second');
  }
  if (diffInSeconds < 3600) {
    return rtf.format(-Math.floor(diffInSeconds / 60), 'minute');
  }
  if (diffInSeconds < 86400) {
    return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour');
  }
  if (diffInSeconds < 2592000) {
    return rtf.format(-Math.floor(diffInSeconds / 86400), 'day');
  }
  if (diffInSeconds < 31536000) {
    return rtf.format(-Math.floor(diffInSeconds / 2592000), 'month');
  }
  return rtf.format(-Math.floor(diffInSeconds / 31536000), 'year');
}

/**
 * Format a number with compact notation
 *
 * @param num - The number to format
 * @param locale - Locale string (default: en-US)
 *
 * @example
 * formatCompactNumber(1234) // '1.2K'
 * formatCompactNumber(1234567) // '1.2M'
 */
export function formatCompactNumber(
  num: number,
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(num);
}

/**
 * Format bytes to human readable size
 *
 * @param bytes - Number of bytes
 * @param decimals - Decimal places (default: 2)
 *
 * @example
 * formatBytes(1024) // '1 KB'
 * formatBytes(1234567) // '1.18 MB'
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Format phone number
 *
 * @param phone - Phone number string
 *
 * @example
 * formatPhoneNumber('1234567890') // '(123) 456-7890'
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3];
  }
  return phone;
}

/**
 * Truncate text with ellipsis
 *
 * @param text - The text to truncate
 * @param length - Maximum length
 *
 * @example
 * truncate('Hello World', 5) // 'Hello...'
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + '...';
}

/**
 * Capitalize first letter
 *
 * @param text - The text to capitalize
 *
 * @example
 * capitalize('hello') // 'Hello'
 */
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Convert to title case
 *
 * @param text - The text to convert
 *
 * @example
 * titleCase('hello world') // 'Hello World'
 */
export function titleCase(text: string): string {
  return text
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Slugify text
 *
 * @param text - The text to slugify
 *
 * @example
 * slugify('Hello World!') // 'hello-world'
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
