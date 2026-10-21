/**
 * Nirvaya Eyecare Centre — Booking & Date Utilities
 * Configured Time Zone: Asia/Kolkata (IST = UTC+05:30)
 */

export const HOSPITAL_TIME_ZONE = 'Asia/Kolkata';
export const TIME_ZONE_LABEL = 'All times are in IST (Indian Standard Time)';

/**
 * Convert a Date object to YYYY-MM-DD string in Asia/Kolkata timezone
 */
export function formatToHospitalDateStr(date) {
  if (!date) return '';
  if (typeof date === 'string') return date;
  return new Intl.DateTimeFormat('en-CA', { timeZone: HOSPITAL_TIME_ZONE }).format(date);
}

/**
 * Convert a Date object or YYYY-MM-DD to YYYY-MM month string in Asia/Kolkata timezone
 */
export function formatToHospitalMonthStr(date) {
  if (!date) return '';
  const dateStr = formatToHospitalDateStr(date);
  return dateStr.substring(0, 7);
}

/**
 * Format a YYYY-MM-DD string to a readable format (e.g. "Thursday, 15 Oct 2026")
 */
export function formatReadableDate(dateStr) {
  if (!dateStr) return '';
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const d = new Date(year, month - 1, day);
    return new Intl.DateTimeFormat('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(d);
  } catch {
    return dateStr;
  }
}

/**
 * Format a YYYY-MM-DD string to a short badge format (e.g. "15 Oct")
 */
export function formatShortDate(dateStr) {
  if (!dateStr) return '';
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const d = new Date(year, month - 1, day);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short'
    }).format(d);
  } catch {
    return dateStr;
  }
}

/**
 * Generate a client-side idempotency key for safe booking retries
 */
export function generateIdempotencyKey() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `idem_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}
