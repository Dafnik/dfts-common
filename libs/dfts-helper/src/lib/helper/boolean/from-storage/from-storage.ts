import {b_from} from '../from/from.js';
import {UndefinedOr} from '../../../types.js';
import {s_fromStorage} from '../../string/from-storage/from-storage.js';

export function b_fromStorage(key: string): UndefinedOr<boolean> {
  const val = s_fromStorage(key);
  return val ? b_from(val) : undefined;
}
