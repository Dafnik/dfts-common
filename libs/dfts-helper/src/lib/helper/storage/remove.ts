/**
 * Removes an entry
 * @param {string} key Key to remove
 */
export function st_remove(key: string): void {
  localStorage.removeItem(key);
}
