import {UndefinedOrNullOr} from '../../types.js';
import {st_remove} from './remove.js';
import {ttlSuffix} from './common.js';
import {s_from} from '../string/from/from.js';
import {d_is} from '../date/is/is.js';
import {b_is} from '../boolean/is/is.js';
import {n_is} from '../number/is/is.js';
import {o_is} from '../object/is/is.js';

/**
 * @param {string} key key for storage item
 * @param {unknown} value
 * @param {number | undefined} ttl Time to live in seconds (no guarantee it is going to be deleted on time)
 */
export function st_set(key: string, value: UndefinedOrNullOr<string | object | Date | boolean | number | unknown>, ttl?: number): void {
  if (value == null) {
    st_remove(key);
    return;
  } else if (n_is(value) || b_is(value)) {
    value = s_from(value);
  } else if (d_is(value)) {
    value = s_from(value.getTime());
  } else if (o_is(value)) {
    value = JSON.stringify(value);
  }

  if (ttl) {
    const deathTime = new Date();
    deathTime.setSeconds(deathTime.getSeconds() + ttl);
    st_set(key + ttlSuffix, deathTime);
  }

  localStorage.setItem(key, value as string);
}
