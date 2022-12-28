/**
 * Randomly shuffles the elements of an array.
 *
 * @template T
 * @param {T[]} array The array to shuffle.
 * @returns {T[]} The shuffled array.
 */
export function a_shuffle<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
