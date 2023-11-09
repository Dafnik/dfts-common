import { st_remove } from './remove';
import { s_generate } from '../string/generator/generator';

export const ttlSuffix = '_ttl';

/**
 * Removes all entries
 */
export function st_removeAll(): void {
  localStorage.clear();
}

/**
 * Get the length of the storage
 */
export function st_size(): number {
  return localStorage.length;
}

/**
 * Checks if local storage is available
 * @return {boolean} Returns <code>true</code> if local storage is available, <code>false</code> if not
 */
export function st_isAvailable(): boolean {
  const test = 'available_test_1';
  try {
    localStorage.setItem(test, test);
    if (localStorage.getItem(test) !== test) {
      return false;
    }
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Checks if local storage is empty
 * @return {boolean} Returns <code>true</code> if local storage is empty, <code>false</code> if not
 */
export function st_isEmpty(): boolean {
  return st_size() === 0;
}

/**
 * Checks if local storage has entries
 * @return {boolean} Returns <code>true</code> if local storage has entries, <code>false</code> if not
 */
export function st_hasEntries(): boolean {
  return !st_isEmpty();
}

/**
 * Checks if local storage is full
 * @return {boolean} Returns <code>true</code> if local storage is full, <code>false</code> if not
 */
export function st_isFull(): boolean {
  const key = s_generate(6, { containsNumbers: true, containsSpecialCharacters: true });
  try {
    localStorage.setItem(key, '0');
  } catch {
    return true;
  } finally {
    st_remove(key);
  }
  return false;
}

/**
 * Checks if local storage is not full
 * @return {boolean} Returns <code>true</code> if local storage is not full, <code>false</code> if not
 */
export function st_isNotFull(): boolean {
  return !st_isFull();
}

/**
 * <b>!!! WARNING! USE WITH CAUTION ONLY !!!</b>
 * <br/><b>SHOULD NEVER BE USED IN PRODUCTION</b>
 * <br/>Fills the complete local storage up (with garbage)
 * @deprecated
 */
export function st_fillUp(): void {
  try {
    for (let i = 1; i <= 10000; i++) {
      localStorage.setItem('fill_up_test_1', new Array(i * 100000).join('a'));
    }
  } catch {
    let j = 1;
    try {
      for (j = 1; j <= 100; j++) {
        localStorage.setItem('fill_up_test_2', new Array(j * 1000).join('a'));
      }
    } catch {
      let k = 1;
      try {
        for (k = 1; k <= 1000; k++) {
          localStorage.setItem('fill_up_test_3', new Array(k).join('a'));
        }
        // eslint-disable-next-line no-empty
      } catch {}
    }
  }
}
