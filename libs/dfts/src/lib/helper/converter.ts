import {NullOr, StringOrNumber, StringOrNumberOr, UndefinedOr, UndefinedOrNullOr} from '../types';
import {b_from} from './boolean/from';
import {s_from} from './string/from';
import {n_from} from './number/from';
import {d_from} from './date/from';

export class Converter {
  /**
   * @deprecated
   * Converts parameter from <code>T | null</code> to <code>T | undefined</code>
   * @param {T|undefined} value Value to convert
   * @return {T|null} Returns <code>T | undefined</code>
   */
  static nullToUndefined<T>(value: NullOr<T>): UndefinedOr<T> {
    return c_nullToUndefined(value);
  }

  /**
   * @deprecated
   * Converts parameter from <code>T | undefined</code> to <code>T | null</code>
   * @param {T|undefined} value Value to convert
   * @return {T|null} Returns <code>T | null</code>
   */
  static undefinedToNull<T>(value: UndefinedOr<T>): NullOr<T> {
    return c_undefinedToNull(value);
  }

  /**
   * @deprecated
   * Converts string or number to boolean
   * @param {string|number|boolean} value Value to convert
   * @return {boolean} Returns <code>true</code> if value is <code>"1"</code>, <code>1</code> or <code>"true"</code>,
   * <code>false</code> if not
   */
  static toBoolean = (value: UndefinedOrNullOr<StringOrNumberOr<boolean>>): boolean => b_from(value);

  /**
   * @deprecated
   * Converts number or boolean to string
   * @param {boolean|number} value Value to check
   * @return {string}
   */
  static toString = (value: UndefinedOrNullOr<StringOrNumberOr<boolean>>): string => s_from(value);

  /**
   * @deprecated
   * Converts string or boolean to number
   * @param {string|boolean} value Value to check
   * @return {number} Returns <code>Number.MAX_SAFE_INTEGER</code> if value is <code>null</code> or <code>undefined</code>
   */
  static toNumber = (value: UndefinedOrNullOr<StringOrNumberOr<boolean>>): number => n_from(value);

  /**
   * @deprecated
   * Converts number or boolean to string
   * @param {boolean|number} value Value to check
   * @return {string}
   */
  static toDate = (value: UndefinedOrNullOr<StringOrNumber | Date>): Date => d_from(value);
}

/**
 * Converts parameter from <code>T | null</code> to <code>T | undefined</code>
 * @param {T|undefined} value Value to convert
 * @return {T|null} Returns <code>T | undefined</code>
 */
export function c_nullToUndefined<T>(value: NullOr<T>): UndefinedOr<T> {
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
export function c_undefinedToNull<T>(value: UndefinedOr<T>): NullOr<T> {
  if (value === undefined) {
    return null;
  }
  return value;
}
