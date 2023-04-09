import {a_forEachIf} from '../for-each-if.js';

/**
 * Applies a computation function to each element in the given array that is present in the `items` list.
 *
 * @template T
 * @param {T[]} array - The array to apply the computation function to.
 * @param {function(value: T): void} callbackFn - The computation function to apply to each element.
 * @param {T[]} items - The list of elements to apply the computation function to.
 * @returns {T[]} The original array.
 */
export function a_forEachIfPresent<T>(array: T[], callbackFn: (value: T) => void, ...items: T[]): T[] {
  return a_forEachIf(array, (item) => item && items.includes(item), callbackFn);
}
