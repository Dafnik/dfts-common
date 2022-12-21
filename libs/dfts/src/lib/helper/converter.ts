import {NullOr, StringOrNumber, StringOrNumberOr, UndefinedOr, UndefinedOrNullOr} from '../types';

export class Converter {
  /**
   * @deprecated
   * Converts parameter from <code>T | null</code> to <code>T | undefined</code>
   * @param {T|undefined} value Value to convert
   * @return {T|null} Returns <code>T | undefined</code>
   */
  static nullToUndefined<T>(value: NullOr<T>): UndefinedOr<T> {
    return nullToUndefined(value);
  }

  /**
   * @deprecated
   * Converts parameter from <code>T | undefined</code> to <code>T | null</code>
   * @param {T|undefined} value Value to convert
   * @return {T|null} Returns <code>T | null</code>
   */
  static undefinedToNull<T>(value: UndefinedOr<T>): NullOr<T> {
    return undefinedToNull(value);
  }

  /**
   * @deprecated
   * Converts string or number to boolean
   * @param {string|number|boolean} value Value to convert
   * @return {boolean} Returns <code>true</code> if value is <code>"1"</code>, <code>1</code> or <code>"true"</code>,
   * <code>false</code> if not
   */
  static toBoolean = (value: UndefinedOrNullOr<StringOrNumberOr<boolean>>): boolean => toBoolean(value);

  /**
   * @deprecated
   * Converts number or boolean to string
   * @param {boolean|number} value Value to check
   * @return {string}
   */
  static toString = (value: UndefinedOrNullOr<StringOrNumberOr<boolean>>): string => toString(value);

  /**
   * @deprecated
   * Converts string or boolean to number
   * @param {string|boolean} value Value to check
   * @return {number} Returns <code>Number.MAX_SAFE_INTEGER</code> if value is <code>null</code> or <code>undefined</code>
   */
  static toNumber = (value: UndefinedOrNullOr<StringOrNumberOr<boolean>>): number => toNumber(value);

  /**
   * @deprecated
   * Converts number or boolean to string
   * @param {boolean|number} value Value to check
   * @return {string}
   */
  static toDate = (value: UndefinedOrNullOr<StringOrNumber | Date>): Date => toDate(value);
}

/**
 * Converts parameter from <code>T | null</code> to <code>T | undefined</code>
 * @param {T|undefined} value Value to convert
 * @return {T|null} Returns <code>T | undefined</code>
 */
export function nullToUndefined<T>(value: NullOr<T>): UndefinedOr<T> {
  if (value === null) {
    return undefined;
  }
  return value;
}

/**
 * Converts parameter from <code>T | undefined</code> to <code>T | null</code>
 * @param {T|undefined} value Value to convert
 * @return {T|null} Returns <code>T | null</code>
 */
export function undefinedToNull<T>(value: UndefinedOr<T>): NullOr<T> {
  if (value === undefined) {
    return null;
  }
  return value;
}

/**
 * Converts string or number to boolean
 * @param {string|number|boolean} value Value to convert
 * @return {boolean} Returns <code>true</code> if value is <code>"1"</code>, <code>1</code> or <code>"true"</code>,
 * <code>false</code> if not
 */
export const toBoolean = (value: UndefinedOrNullOr<StringOrNumberOr<boolean>>): boolean => {
  if (value == null) {
    return false;
  }
  if (typeof value === 'boolean') {
    return value;
  }
  return typeof value !== 'number' ? value.trim().toLowerCase() === 'true' || value.trim().toLowerCase() === '1' : value === 1;
};

/**
 * Converts number or boolean to string
 * @param {boolean|number} value Value to check
 * @return {string}
 */
export const toString = (value: UndefinedOrNullOr<StringOrNumberOr<boolean>>): string => {
  if (value == null) {
    return '';
  }
  if (typeof value === 'string') {
    return value;
  }
  return typeof value !== 'number' ? (value ? 'true' : 'false') : value.toString();
};

/**
 * Converts string or boolean to number
 * @param {string|boolean} value Value to check
 * @return {number} Returns <code>Number.MAX_SAFE_INTEGER</code> if value is <code>null</code> or <code>undefined</code>
 */
export const toNumber = (value: UndefinedOrNullOr<StringOrNumberOr<boolean>>): number => {
  if (value == null) {
    return Number.MAX_SAFE_INTEGER;
  }
  if (typeof value === 'number') {
    return value;
  }
  return typeof value !== 'string' ? (value ? 1 : 0) : parseFloat(value);
};

/**
 * Converts number or boolean to string
 * @param {boolean|number} value Value to check
 * @return {string}
 */
export const toDate = (value: UndefinedOrNullOr<StringOrNumber | Date>): Date => (value ? new Date(value) : new Date());
