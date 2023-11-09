import { ICompute, IPredicate } from '../../types';

export function a_forEachIf<T>(array: T[], filterFn: IPredicate<T>, callbackFn: ICompute<T>): T[] {
  for (const item of array) {
    if (filterFn(item)) {
      callbackFn(item);
    }
  }
  return array;
}
