import {n_from} from '../../number/from/from.js';
import {UndefinedOr} from '../../../types.js';
import {s_fromStorage} from '../../string/from-storage/from-storage.js';

export function d_fromStorage(key: string): UndefinedOr<Date> {
  const val = s_fromStorage(key);
  return val ? new Date(n_from(val)) : undefined;
}
