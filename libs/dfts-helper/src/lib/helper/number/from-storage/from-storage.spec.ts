import { st_removeAll } from '../../storage/common';
import { st_set } from '../../storage/set';
import { n_fromStorage } from './from-storage';

describe('StorageHelper', () => {
  beforeEach(() => {
    st_removeAll();
  });

  it('set&GetNumber', () => {
    st_set('key1', 1);
    st_set('key2', 222222222222);
    st_set('key3', 2020201.12);

    expect(n_fromStorage('key1')).toBe(1);
    expect(n_fromStorage('key2')).toBe(222222222222);
    expect(n_fromStorage('key3')).toBe(2020201.12);
    expect(n_fromStorage('key1000')).toBe(undefined);
  });
});
