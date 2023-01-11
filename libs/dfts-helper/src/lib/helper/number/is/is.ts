/**
 * Checks if object is <code>number</code>
 * @param {unknown} obj
 * @return boolean Returns <code>true</code> if object is <code>number</code>, <code>false</code> if not
 */
export const n_is = (obj: unknown): obj is number => typeof obj === 'number';
