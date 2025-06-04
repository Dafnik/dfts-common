/**
 * Converts nearly everything to string
 * @param {boolean|number|null|undefined|string} value Value to convert
 * @return {string}
 */
export const s_from = (value: string | number | boolean | undefined | null): string => {
  if (value == null) {
    return '';
  }
  if (typeof value === 'string') {
    return value;
  }
  return typeof value !== 'number' ? (value ? 'true' : 'false') : value.toString();
};
