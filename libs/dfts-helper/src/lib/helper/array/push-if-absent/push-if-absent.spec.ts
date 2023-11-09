import { a_pushIfAbsent } from './push-if-absent';

describe('push If absent', () => {
  it('string to work', () => {
    expect(a_pushIfAbsent(['abc', 'bcc', 'cdf', 'xyz'], 'hjk')).toEqual(['abc', 'bcc', 'cdf', 'xyz', 'hjk']);
    expect(a_pushIfAbsent(['abc', 'bcc', 'cdf', 'xyz'], 'abc')).toEqual(['abc', 'bcc', 'cdf', 'xyz']);
  });
  it('number to work', () => {
    expect(a_pushIfAbsent([1, 2, 3, 4, 5, 7], 200)).toEqual([1, 2, 3, 4, 5, 7, 200]);
    expect(a_pushIfAbsent([1, 2, 3, 4, 5, 200], 200)).toEqual([1, 2, 3, 4, 5, 200]);
  });
});
