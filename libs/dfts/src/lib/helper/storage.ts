import {isBoolean, isDate, isNumber, isObject} from './type';
import {toBoolean, toNumber, toString} from './converter';
import {UndefinedOr, UndefinedOrAny, UndefinedOrNullOr} from '../types';
import {Generator, RandomStringOptions} from './generator';

export class StorageHelper {
  private static ttlSuffix = '_ttl';

  //region Setter

  /**
   * @param {string} key key for storage item
   * @param {unknown} value
   * @param {number | undefined} ttl Time to live in seconds (no guarantee it is going to be deleted on time)
   */
  static set(key: string, value: null | undefined | unknown, ttl?: number): void;
  /**
   * @param {string} key key for storage item
   * @param {unknown} value
   * @param {number | undefined} ttl Time to live in seconds (no guarantee it is going to be deleted on time)
   */
  static set(key: string, value: UndefinedOrNullOr<number>, ttl?: number): void;
  /**
   * @param {string} key key for storage item
   * @param {unknown} value
   * @param {number | undefined} ttl Time to live in seconds (no guarantee it is going to be deleted on time)
   */
  static set(key: string, value: UndefinedOrNullOr<boolean>, ttl?: number): void;
  /**
   * @param {string} key key for storage item
   * @param {unknown} value
   * @param {number | undefined} ttl Time to live in seconds (no guarantee it is going to be deleted on time)
   */
  static set(key: string, value: UndefinedOrNullOr<Date>, ttl?: number): void;
  /**
   * @param {string} key key for storage item
   * @param {unknown} value
   * @param {number | undefined} ttl Time to live in seconds (no guarantee it is going to be deleted on time)
   */
  static set(key: string, value: UndefinedOrNullOr<Object>, ttl?: number): void;
  /**
   * @param {string} key key for storage item
   * @param {unknown} value
   * @param {number | undefined} ttl Time to live in seconds (no guarantee it is going to be deleted on time)
   */
  static set(key: string, value: UndefinedOrNullOr<string>, ttl?: number): void;
  /**
   * @param {string} key key for storage item
   * @param {unknown} value
   * @param {number | undefined} ttl Time to live in seconds (no guarantee it is going to be deleted on time)
   */
  static set(key: string, value: unknown, ttl?: number): void {
    if (value == null) {
      this.remove(key);
      return;
    } else if (isNumber(value) || isBoolean(value)) {
      value = toString(value);
    } else if (isDate(value)) {
      value = toString(value.getTime());
    } else if (isObject(value)) {
      value = JSON.stringify(value);
    }

    if (ttl) {
      const deathTime = new Date();
      deathTime.setSeconds(deathTime.getSeconds() + ttl);
      this.set(key + this.ttlSuffix, deathTime);
    }

    localStorage.setItem(key, value as string);
  }

  //endregion

  //region Getter
  static getString(key: string): string | undefined {
    const ttl = localStorage.getItem(key + this.ttlSuffix);
    if (ttl) {
      if (new Date().getTime() > new Date(toNumber(ttl)).getTime()) {
        localStorage.removeItem(key + this.ttlSuffix);
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

  static getNumber(key: string): UndefinedOr<number> {
    const val = this.getString(key);
    return val ? toNumber(val) : undefined;
  }

  static getBoolean(key: string): UndefinedOr<boolean> {
    const val = this.getString(key);
    return val ? toBoolean(val) : undefined;
  }

  static getDate(key: string): UndefinedOr<Date> {
    const val = this.getString(key);
    return val ? new Date(toNumber(val)) : undefined;
  }

  static getObject(key: string): UndefinedOrAny {
    const val = this.getString(key);
    return val ? JSON.parse(val) : undefined;
  }

  //endregion

  /**
   * Check if a specific entry exists
   * @param {string} key
   * @return boolean Returns <code>true</code> if an entry exists, <code>false</code> if not
   */
  static exists(key: string): boolean {
    return this.getString(key) != undefined;
  }

  /**
   * Removes an entry
   * @param {string} key Key to remove
   */
  static remove(key: string): void {
    localStorage.removeItem(key);
  }

  /**
   * Removes all entries
   */
  static removeAll(): void {
    localStorage.clear();
  }

  /**
   * Get the length of the storage
   */
  static size(): number {
    return localStorage.length;
  }

  /**
   * Checks if local storage is available
   * @return {boolean} Returns <code>true</code> if local storage is available, <code>false</code> if not
   */
  static isAvailable(): boolean {
    const test = 'available_test_1';
    try {
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Checks if local storage is empty
   * @return {boolean} Returns <code>true</code> if local storage is empty, <code>false</code> if not
   */
  static isEmpty(): boolean {
    return this.size() === 0;
  }

  /**
   * Checks if local storage has entries
   * @return {boolean} Returns <code>true</code> if local storage has entries, <code>false</code> if not
   */
  static hasEntries(): boolean {
    return !this.isEmpty();
  }

  /**
   * Checks if local storage is full
   * @return {boolean} Returns <code>true</code> if local storage is full, <code>false</code> if not
   */
  static isFull(): boolean {
    const key = Generator.stringByOptions(6, RandomStringOptions.NUMBERS, RandomStringOptions.SPECIAL_CHARACTERS);
    try {
      localStorage.setItem(key, '0');
    } catch {
      return true;
    }
    this.remove(key);
    return false;
  }

  /**
   * Checks if local storage is not full
   * @return {boolean} Returns <code>true</code> if local storage is not full, <code>false</code> if not
   */
  static isNotFull(): boolean {
    return !this.isFull();
  }

  /**
   * <b>!!! WARNING! USE WITH CAUTION ONLY !!!</b>
   * <br/><b>SHOULD NEVER BE USED IN PRODUCTION</b>
   * <br/>Fills the complete local storage up (with garbage)
   * @deprecated
   */
  static fillUp(): void {
    try {
      for (let i = 1; i <= 10000; i++) {
        localStorage.setItem('fill_up_test_1', new Array(i * 100000).join('a'));
      }
    } catch {
      let j = 1;
      try {
        for (j = 1; j <= 100; j++) {
          localStorage.setItem('fill_up_test_2', new Array(j * 1000).join('a'));
        }
      } catch {
        let k = 1;
        try {
          for (k = 1; k <= 1000; k++) {
            localStorage.setItem('fill_up_test_3', new Array(k).join('a'));
          }
        } catch {}
      }
    }
  }
}
