import en from '@/locales/en.json';

/**
 * Resolve dot-notated string key from the language file.
 * Example: t('common.preBookSlot') -> "Pre-book a Slot"
 *
 * @param {string} key - Dot notation path into en.json
 * @param {string} [fallback=''] - Optional fallback if key is missing
 * @returns {any} Resolved translation string or object
 */
export function t(key, fallback = '') {
  if (!key) return fallback;
  const parts = key.split('.');
  let current = en;
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      return fallback || key;
    }
  }
  return current;
}

export { en };
export default en;
