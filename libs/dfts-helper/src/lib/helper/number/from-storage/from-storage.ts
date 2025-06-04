import { s_fromStorage } from '../../string/from-storage/from-storage';
import { n_from } from '../from/from';

export function n_fromStorage(key: string): number | undefined {
  const val = s_fromStorage(key);
  return val ? n_from(val) : undefined;
}
