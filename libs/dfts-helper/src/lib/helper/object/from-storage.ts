import {UndefinedOr} from '../../types';
import {s_fromStorage} from '../string/from-storage';

export function o_fromStorage<T>(key: string): UndefinedOr<T> {
  const val = s_fromStorage(key);
  return val ? JSON.parse(val) : undefined;
}
