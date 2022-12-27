import {ttlSuffix} from '../storage/common';
import {n_from} from '../converter';

export function s_fromStorage(key: string): string | undefined {
  const ttl = localStorage.getItem(key + ttlSuffix);
  if (ttl) {
    if (new Date().getTime() > new Date(n_from(ttl)).getTime()) {
      localStorage.removeItem(key + ttlSuffix);
      localStorage.removeItem(key);
      return undefined;
    }
  }

  const val = localStorage.getItem(key);
  if (val === null) {
    return undefined;
  }
  return val;
}
