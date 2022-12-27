import {StringOrNumber} from '../types';

export class TypeHelper {
  /**
   * @deprecated
   * Checks if object is <code>Date</code>
   * @param {unknown} obj
   * @return boolean Returns <code>true</code> if object is <code>Date</code>, <code>false</code> if not
   */
  static isDate = (obj: unknown): obj is Date => t_isDate(obj);

  /**
   * @deprecated
   * Checks if object is <code>boolean</code>
   * @param {unknown} obj
   * @return boolean Returns <code>true</code> if object is <code>boolean</code>, <code>false</code> if not
   */
  static isBoolean = (obj: unknown): obj is boolean => t_isBoolean(obj);

  /**
   * @deprecated
   * Checks if object is <code>string</code>
   * @param {unknown} obj
   * @return boolean Returns <code>true</code> if object is <code>string</code>, <code>false</code> if not
   */
  static isString = (obj: unknown): obj is string => t_isString(obj);

  /**
   * @deprecated
   * Checks if object is <code>number</code>
   * @param {unknown} obj
   * @return boolean Returns <code>true</code> if object is <code>number</code>, <code>false</code> if not
   */
  static isNumber = (obj: unknown): obj is number => t_isNumber(obj);

  /**
   * @deprecated
   * Checks if object is <code>object</code>
   * @param {unknown} obj
   * @return boolean Returns <code>true</code> if object is <code>object</code>, <code>false</code> if not
   */
  static isObject = (obj: unknown): obj is object => t_isObject(obj);

  /**
   * @deprecated
   * Checks if object is <code>numeric</code>
   * @param {unknown} obj
   * @return boolean Returns <code>true</code> if object is <code>numeric</code>, else <code>false</code>
   */
  static isNumeric = (obj: unknown): obj is StringOrNumber => t_isNumeric(obj);
}

/**
 * Checks if object is <code>Date</code>
 * @param {unknown} obj
 * @return boolean Returns <code>true</code> if object is <code>Date</code>, <code>false</code> if not
 */
export const t_isDate = (obj: unknown): obj is Date => Object.prototype.toString.call(obj) === '[object Date]';

/**
 * Checks if object is <code>boolean</code>
 * @param {unknown} obj
 * @return boolean Returns <code>true</code> if object is <code>boolean</code>, <code>false</code> if not
 */
export const t_isBoolean = (obj: unknown): obj is boolean => obj === true || obj === false || typeof obj == 'boolean';

/**
 * Checks if object is <code>string</code>
 * @param {unknown} obj
 * @return boolean Returns <code>true</code> if object is <code>string</code>, <code>false</code> if not
 */
export const t_isString = (obj: unknown): obj is string => typeof obj === 'string';

/**
 * Checks if object is <code>number</code>
 * @param {unknown} obj
 * @return boolean Returns <code>true</code> if object is <code>number</code>, <code>false</code> if not
 */
export const t_isNumber = (obj: unknown): obj is number => typeof obj === 'number';

/**
 * Checks if object is <code>object</code>
 * @param {unknown} obj
 * @return boolean Returns <code>true</code> if object is <code>object</code>, <code>false</code> if not
 */
export const t_isObject = (obj: unknown): obj is object =>
  typeof obj === 'object' && obj !== null && obj !== undefined && !Array.isArray(obj);

/**
 * Checks if object is <code>numeric</code>
 * @param {unknown} obj
 * @return boolean Returns <code>true</code> if object is <code>numeric</code>, else <code>false</code>
 */
export const t_isNumeric = (obj: unknown): obj is StringOrNumber => {
  if (typeof obj == 'number') {
    return true;
  }
  // only process strings
  if (typeof obj != 'string') {
    return false;
  }
  return (
    !isNaN(parseInt(obj, 10)) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(obj))
  );
};
