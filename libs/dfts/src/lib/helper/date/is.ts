/**
 * Checks if object is <code>Date</code>
 * @param {unknown} obj
 * @return boolean Returns <code>true</code> if object is <code>Date</code>, <code>false</code> if not
 */
export const d_is = (obj: unknown): obj is Date => Object.prototype.toString.call(obj) === '[object Date]';
