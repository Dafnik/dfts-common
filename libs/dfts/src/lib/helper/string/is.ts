/**
 * Checks if object is <code>string</code>
 * @param {unknown} obj
 * @return boolean Returns <code>true</code> if object is <code>string</code>, <code>false</code> if not
 */
export const s_is = (obj: unknown): obj is string => typeof obj === 'string';
