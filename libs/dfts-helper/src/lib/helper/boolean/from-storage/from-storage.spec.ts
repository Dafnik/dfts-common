import { st_removeAll } from '../../storage/common';
import { st_set } from '../../storage/set';
import { b_fromStorage } from './from-storage';

describe('StorageHelper', () => {
  beforeEach(() => {
    st_removeAll();
  });

  it('set&GetBoolean', () => {
    st_set('key1', true);
    st_set('key2', false);

    expect(b_fromStorage('key1')).toBeTruthy();
    expect(b_fromStorage('key2')).toBeFalsy();
    expect(b_fromStorage('key1000')).toBe(undefined);
  });
});
