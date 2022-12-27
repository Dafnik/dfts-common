import {a_pushIf} from './push-if';

/**
 * Push items to an array if they are not already present.
 *
 * @template T
 * @param {T[]} array The array to push items to.
 * @param {...T} items The items to push to the array.
 * @returns {T[]} The modified array.
 */
export function a_pushIfAbsent<T>(array: T[], ...items: T[]): T[] {
  return a_pushIf(array, (it) => !array.includes(it), ...items);
}
