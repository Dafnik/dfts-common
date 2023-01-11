import {st_removeAll} from '../../storage/common';
import {st_set} from '../../storage/set';
import {s_fromStorage} from './from-storage';
import {st_exists} from '../../storage/exists';

describe('StorageHelper', () => {
  beforeEach(() => {
    st_removeAll();
  });

  it('set&GetString', () => {
    st_set('key1', 'This is a test');
    st_set('key2', 'werwerwero1234567890ß__....-,,;;;+++#ä#!"§$%&/()=?`~+.:,;·|<>');
    st_set('key3', '202012312341234201.12112341234');
    st_set('key4', 'true');

    st_set('key20', 'test');
    expect(s_fromStorage('key20')).toBe('test');
    st_set('key20', null);
    expect(s_fromStorage('key20')).toBe(undefined);
    expect(st_exists('key20')).toBeFalsy();

    expect(s_fromStorage('key1')).toBe('This is a test');
    expect(s_fromStorage('key2')).toBe('werwerwero1234567890ß__....-,,;;;+++#ä#!"§$%&/()=?`~+.:,;·|<>');
    expect(s_fromStorage('key3')).toBe('202012312341234201.12112341234');
    expect(s_fromStorage('key4')).toBe('true');
    expect(s_fromStorage('key1000')).toBe(undefined);
  });
});
