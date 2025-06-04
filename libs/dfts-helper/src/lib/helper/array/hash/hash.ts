/**
 * Selects an element from an array based on a hash derived from a string.
 *
 * The hashing algorithm is a simple polynomial rolling hash that uses
 * a base of 31 and takes the modulo 2^32 to ensure the hash is a 32-bit unsigned integer.
 *
 * @template T - The type of elements in the array.
 * @param {T[]} array - The array from which to select an element.
 * @param {string} str - The string used to generate the hash.
 * @returns {T} The element from the array corresponding to the generated hash.
 *
 * @example
 * const colors = ['red', 'green', 'blue', 'yellow'];
 * a_hashFrom(colors, 'apple'); // Returns 'green' (or another color depending on hash)
 * a_hashFrom(colors, 'banana'); // Returns a different color
 * a_hashFrom(colors, ''); // Returns 'red' (array[0])
 */
export function a_hashFrom<T>(array: T[], str: string): T {
  const length = str.length;
  if (length === 0) return array[0];

  let hash = 0;
  for (let i = 0; i < length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }

  return array[hash % array.length];
}
