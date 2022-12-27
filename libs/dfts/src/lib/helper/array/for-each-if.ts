import {ICompute, IPredicate} from '../../types';

export function forEachIf<T>(array: T[], callbackFn: ICompute<T>, filterFn: IPredicate<T>): T[] {
  for (const item of array) {
    if (item && filterFn(item)) {
      callbackFn(item);
    }
  }
  return array;
}
