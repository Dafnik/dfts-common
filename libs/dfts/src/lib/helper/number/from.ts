import {StringOrNumberOr, UndefinedOrNullOr} from '../../types';

/**
 * Converts nearly everything to number
 * @param {undefined|null|number|string|boolean} value Value to convert
 * @return {number} Returns <code>Number.MAX_SAFE_INTEGER</code> if value is <code>null</code> or <code>undefined</code>
 */
export const n_from = (value: UndefinedOrNullOr<StringOrNumberOr<boolean>>): number => {
  if (value == null) {
    return Number.MAX_SAFE_INTEGER;
  }
  if (typeof value === 'number') {
    return value;
  }
  return typeof value !== 'string' ? (value ? 1 : 0) : parseFloat(value);
};
