/**
 * Checks if object is <code>object</code>
 * @param {unknown} obj
 * @return boolean Returns <code>true</code> if object is <code>object</code>, <code>false</code> if not
 */
export const o_is = (obj: unknown): obj is object => typeof obj === 'object' && obj !== null && obj !== undefined && !Array.isArray(obj);
