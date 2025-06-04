import { s_fromStorage } from '../../string/from-storage/from-storage';

export function o_fromStorage<T>(key: string): T | undefined {
  const val = s_fromStorage(key);
  return val ? JSON.parse(val) : undefined;
}
