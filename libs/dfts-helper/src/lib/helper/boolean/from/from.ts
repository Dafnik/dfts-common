import {StringOrNumberOr, UndefinedOrNullOr} from '../../../types';

/**
 * Converts string or number to boolean
 * @param {string|number|boolean} value Value to convert
 * @return {boolean} Returns <code>true</code> if value is <code>"1"</code>, <code>1</code> or <code>"true"</code>,
 * <code>false</code> if not
 */
export const b_from = (value: UndefinedOrNullOr<StringOrNumberOr<boolean>>): boolean => {
  if (value == null) {
    return false;
  }
  if (typeof value === 'boolean') {
    return value;
  }
  return typeof value !== 'number' ? value.trim().toLowerCase() === 'true' || value.trim().toLowerCase() === '1' : value === 1;
};
