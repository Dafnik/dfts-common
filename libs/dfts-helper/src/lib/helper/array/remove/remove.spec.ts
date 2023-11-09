import { a_remove } from './remove';

describe('remove', () => {
  it('string', () => {
    expect(a_remove(['abc', 'bcc', 'cdf', 'xyz'], 'hjk')).toEqual(['abc', 'bcc', 'cdf', 'xyz']);
    expect(a_remove(['abc', 'bcc', 'cdf', 'xyz'], 'abc')).toEqual(['bcc', 'cdf', 'xyz']);
  });
  it('number', () => {
    expect(a_remove([1, 2, 3, 4, 5, 7], 200)).toEqual([1, 2, 3, 4, 5, 7]);
    expect(a_remove([1, 2, 3, 4, 5, 200], 200)).toEqual([1, 2, 3, 4, 5]);
  });
});
