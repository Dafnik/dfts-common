import { n_from } from '../../number/from/from';
import { s_fromStorage } from '../../string/from-storage/from-storage';

export function d_fromStorage(key: string): Date | undefined {
  const val = s_fromStorage(key);
  return val ? new Date(n_from(val)) : undefined;
}
