import { st_removeAll } from '../../storage/common';
import { st_set } from '../../storage/set';
import { o_fromStorage } from './from-storage';

describe('StorageHelper', () => {
  beforeEach(() => {
    st_removeAll();
  });

  it('set&GetObject', () => {
    const o1 = { test: 'wowowoww', bub: 'bib' };
    const o2 = { '12341234': '333333', '--.:dasdf': 'wowowowo' };
    st_set('key1', o1);
    st_set('key2', o2);
    st_set('key3', null);
    st_set('key4', undefined);

    expect(o_fromStorage('key1')).toEqual(o1);
    expect(o_fromStorage('key2')).toEqual(o2);
    expect(o_fromStorage('key3')).toBe(undefined);
    expect(o_fromStorage('key4')).toBe(undefined);
    expect(o_fromStorage('key1000')).toBe(undefined);
  });
});
