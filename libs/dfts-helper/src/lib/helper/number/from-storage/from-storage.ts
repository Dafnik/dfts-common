import {n_from} from '../from/from.js';
import {UndefinedOr} from '../../../types.js';
import {s_fromStorage} from '../../string/from-storage/from-storage.js';

export function n_fromStorage(key: string): UndefinedOr<number> {
  const val = s_fromStorage(key);
  return val ? n_from(val) : undefined;
}
