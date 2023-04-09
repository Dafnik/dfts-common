import {StringOrNumber} from '../../../types.js';

/**
 * Checks if object is <code>numeric</code>
 * @param {unknown} obj
 * @return boolean Returns <code>true</code> if object is <code>numeric</code>, else <code>false</code>
 */
export const n_isNumeric = (obj: unknown): obj is StringOrNumber => {
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
