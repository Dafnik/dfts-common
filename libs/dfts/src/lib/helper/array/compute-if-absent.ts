/**
 * Applies a computation function to each element in the given `items` list that is not present in the array.
 *
 * @template T
 * @param {T[]} array - The array to check for the presence of the `items`.
 * @param {function(value: T): void} computeFunction - The computation function to apply to each element.
 * @param {T[]} items - The list of elements to apply the computation function to.
 * @returns {T[]} The original array.
 */
export function a_computeIfAbsent<T>(array: T[], computeFunction: (value: T) => void, ...items: T[]): T[] {
  for (const item of items) {
    if (item && !array.includes(item)) {
      computeFunction(item);
    }
  }
  return array;
}
