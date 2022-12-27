import {UndefinedOrNullOr} from '../../types';
import {t_isBoolean, t_isDate, t_isNumber, t_isObject} from '../type';
import {st_remove} from './remove';
import {ttlSuffix} from './common';
import {s_from} from '../string/from';

/**
 * @param {string} key key for storage item
 * @param {unknown} value
 * @param {number | undefined} ttl Time to live in seconds (no guarantee it is going to be deleted on time)
 */
export function st_set(key: string, value: UndefinedOrNullOr<string | object | Date | boolean | number | unknown>, ttl?: number): void {
  if (value == null) {
    st_remove(key);
    return;
  } else if (t_isNumber(value) || t_isBoolean(value)) {
    value = s_from(value);
  } else if (t_isDate(value)) {
    value = s_from(value.getTime());
  } else if (t_isObject(value)) {
    value = JSON.stringify(value);
  }

  if (ttl) {
    const deathTime = new Date();
    deathTime.setSeconds(deathTime.getSeconds() + ttl);
    st_set(key + ttlSuffix, deathTime);
  }

  localStorage.setItem(key, value as string);
}
