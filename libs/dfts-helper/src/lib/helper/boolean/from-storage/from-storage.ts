import { s_fromStorage } from '../../string/from-storage/from-storage';
import { b_from } from '../from/from';

export function b_fromStorage(key: string): boolean | undefined {
  const val = s_fromStorage(key);
  return val ? b_from(val) : undefined;
}
