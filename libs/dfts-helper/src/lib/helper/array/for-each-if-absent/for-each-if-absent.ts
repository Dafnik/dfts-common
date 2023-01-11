import {a_forEachIf} from '../for-each-if';

/**
 * Applies a computation function to each element in the given `items` list that is not present in the array.
 *
 * @template T
 * @param {T[]} array - The array to check for the presence of the `items`.
 * @param {function(value: T): void} callbackFn - The computation function to apply to each element.
 * @param {T[]} items - The list of elements to apply the computation function to.
 * @returns {T[]} The original array.
 */
export function a_forEachIfAbsent<T>(array: T[], callbackFn: (value: T) => void, ...items: T[]): T[] {
  return a_forEachIf(items, (item) => item && !array.includes(item), callbackFn);
}
