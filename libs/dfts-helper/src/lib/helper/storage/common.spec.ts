import { b_fromStorage } from '../boolean/from-storage/from-storage';
import { n_fromStorage } from '../number/from-storage/from-storage';
import { o_fromStorage } from '../object/from-storage/from-storage';
import { s_fromStorage } from '../string/from-storage/from-storage';
import { thr_sleep } from '../thread';
import { st_fillUp, st_hasEntries, st_isAvailable, st_isEmpty, st_isFull, st_isNotFull, st_removeAll, st_size } from './common';
import { st_exists } from './exists';
import { st_remove } from './remove';
import { st_set } from './set';

describe('StorageHelper', () => {
  beforeEach(() => {
    st_removeAll();
  });
  it('isAvailable', () => {
    expect(st_isAvailable()).toBeTruthy();
  });
  it('checkExists&Remove&Size&Empty&hasEntries', () => {
    st_set('key1', 'This is a test');
    st_set('key2', 'werwerwero1234567890ß__....-,,;;;+++#ä#!"§$%&/()=?`~+.:,;·|<>');
    st_set('key3', '202012312341234201.12112341234');
    st_set('key4', 'true');

    expect(st_exists('key1000')).toBeFalsy();
    expect(st_exists('key1')).toBeTruthy();
    expect(st_size()).toBe(4);
    st_remove('key1');
    expect(st_exists('key1')).toBeFalsy();
    expect(st_size()).toBe(3);
    expect(st_hasEntries()).toBeTruthy();
    expect(st_isEmpty()).toBeFalsy();
    st_removeAll();
    expect(st_isEmpty()).toBeTruthy();
    expect(st_hasEntries()).toBeFalsy();
  });
  it('checkIsEmptyAndIsFull', () => {
    expect(st_isEmpty()).toBeTruthy();
    expect(st_isFull()).toBeFalsy();
    expect(st_isNotFull()).toBeTruthy();
    st_fillUp();
    expect(st_isFull()).toBeTruthy();
    expect(st_isNotFull()).toBeFalsy();
  });
  it('set&GetUndefinied', () => {
    st_set('key1', 'test');
    st_set('key2', 1);
    st_set('key3', false);
    const o = { bla: 'bli', test: 'tust' };
    st_set('key4', o);
    expect(s_fromStorage('key1')).toBe('test');
    expect(n_fromStorage('key2')).toBe(1);
    expect(b_fromStorage('key3')).toBeFalsy();
    expect(o_fromStorage('key4')).toEqual(o);
    expect(st_size()).toBe(4);

    st_set('key1', undefined);
    st_set('key2', undefined);
    st_set('key3', undefined);
    st_set('key4', undefined);

    expect(st_exists('key1')).toBeFalsy();
    expect(st_exists('key2')).toBeFalsy();
    expect(st_exists('key3')).toBeFalsy();
    expect(st_exists('key4')).toBeFalsy();
    expect(s_fromStorage('key1')).toBe(undefined);
    expect(n_fromStorage('key2')).toBe(undefined);
    expect(b_fromStorage('key3')).toBe(undefined);
    expect(o_fromStorage('key4')).toBe(undefined);
    expect(st_isEmpty).toBeTruthy();

    st_set('key1', null);
    st_set('key2', null);
    st_set('key3', null);
    st_set('key4', null);

    expect(st_exists('key1')).toBeFalsy();
    expect(st_exists('key2')).toBeFalsy();
    expect(st_exists('key3')).toBeFalsy();
    expect(st_exists('key4')).toBeFalsy();
    expect(s_fromStorage('key1')).toBe(undefined);
    expect(n_fromStorage('key2')).toBe(undefined);
    expect(b_fromStorage('key3')).toBe(undefined);
    expect(o_fromStorage('key4')).toBe(undefined);
    expect(st_isEmpty).toBeTruthy();
  });
  it('set&GetUndefined&Anything', () => {
    const test = (testVar: string | undefined) => {
      st_set('key11', testVar);
    };
    test('testtt');
    expect(s_fromStorage('key11')).toBe('testtt');

    const test1 = (testVar: number | undefined) => {
      st_set('key11', testVar);
    };
    test1(10);
    expect(n_fromStorage('key11')).toBe(10);

    const test2 = (testVar: boolean | undefined) => {
      st_set('key11', testVar);
    };
    test2(false);
    expect(b_fromStorage('key11')).toBe(false);
  });
  it('set&GetTTL', async () => {
    st_set('key1', 'This is a test', 1);
    st_set('key2', 'This is a test', 1);
    st_set('key3', 'This is a test', 3);
    expect(st_exists('key1')).toBeTruthy();
    expect(st_exists('key2')).toBeTruthy();

    await thr_sleep(1100);

    expect(st_exists('key1')).toBeFalsy();
    expect(s_fromStorage('key1')).toBeUndefined();
    expect(s_fromStorage('key2')).toBeUndefined();
    expect(st_exists('key2')).toBeFalsy();
    expect(s_fromStorage('key3')).toBeDefined();
    expect(st_exists('key3')).toBeTruthy();
  });
});
