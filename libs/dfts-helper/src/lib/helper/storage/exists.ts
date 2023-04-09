import {s_fromStorage} from '../string/from-storage/from-storage.js';

/**
 * Check if a specific entry exists
 * @param {string} key
 * @return boolean Returns <code>true</code> if an entry exists, <code>false</code> if not
 */
export function st_exists(key: string): boolean {
  return s_fromStorage(key) != undefined;
}
