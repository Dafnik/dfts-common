import {st_removeAll} from '../../storage/common';
import {st_set} from '../../storage/set';
import {d_fromStorage} from './from-storage';

describe('StorageHelper', () => {
  beforeEach(() => {
    st_removeAll();
  });

  it('set&GetDate', () => {
    const d1 = new Date();
    const d2 = new Date();
    d2.setDate(3);
    st_set('key1', d1);
    st_set('key2', d2);

    expect(d_fromStorage('key1')).toEqual(d1);
    expect(d_fromStorage('key2')).toEqual(d2);
    expect(d_fromStorage('key1000')).toBe(undefined);
  });
});
