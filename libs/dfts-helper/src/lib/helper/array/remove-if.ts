import { IPredicate } from '../../types';

export function a_removeIf<T>(array: T[], filterFn: IPredicate<T>, ...items: T[]): T[] {
  for (const item of items) {
    if (item && filterFn(item)) {
      const itemIndex = array.indexOf(item);
      if (itemIndex !== -1) {
        array.splice(itemIndex, 1);
      }
    }
  }
  return array;
}
