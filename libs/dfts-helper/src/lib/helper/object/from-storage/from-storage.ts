import {UndefinedOr} from '../../../types.js';
import {s_fromStorage} from '../../string/from-storage/from-storage.js';

export function o_fromStorage<T>(key: string): UndefinedOr<T> {
  const val = s_fromStorage(key);
  return val ? JSON.parse(val) : undefined;
}
