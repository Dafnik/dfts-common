import {b_from} from '../boolean/from';
import {UndefinedOr} from '../../types';
import {s_fromStorage} from '../string/from-storage';

export function b_fromStorage(key: string): UndefinedOr<boolean> {
  const val = s_fromStorage(key);
  return val ? b_from(val) : undefined;
}
