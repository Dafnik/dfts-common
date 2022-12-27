import {n_from} from '../converter';
import {UndefinedOr} from '../../types';
import {s_fromStorage} from '../string/from-storage';

export function n_fromStorage(key: string): UndefinedOr<number> {
  const val = s_fromStorage(key);
  return val ? n_from(val) : undefined;
}
