import {IPredicate} from '../../types';

/**
 * Push items to an array if they meet a certain condition.
 *
 * @template T
 * @param {T[]} array The array to push items to.
 * @param {IPredicate<T>} filterFn A callback function that returns true if an item should be pushed to the array.
 * @param {...T} items The items to push to the array.
 * @returns {T[]} The modified array.
 */
export function a_pushIf<T>(array: T[], filterFn: IPredicate<T>, ...items: T[]): T[] {
  for (const item of items) {
    if (item && filterFn(item)) {
      array.push(item);
    }
  }
  return array;
}
