/**
 * Checks if object is <code>boolean</code>
 * @param {unknown} obj
 * @return boolean Returns <code>true</code> if object is <code>boolean</code>, <code>false</code> if not
 */
export const b_is = (obj: unknown): obj is boolean => obj === true || obj === false || typeof obj == 'boolean';
