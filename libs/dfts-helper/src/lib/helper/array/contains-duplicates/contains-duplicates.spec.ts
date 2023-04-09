import {a_containsDuplicates} from './contains-duplicates.js';

describe('containsDuplicates', () => {
  it('string to work', () => {
    expect(a_containsDuplicates(['abc', 'abc', 'abc', 'bcc', 'cdf', 'xyz'])).toBeTruthy();
    expect(a_containsDuplicates(['abc', 'bcc', 'cdf', 'xyz'])).toBeFalsy();
  });
  it('number to work', () => {
    expect(a_containsDuplicates([1, 2, 3, 4, 5, 7])).toBeFalsy();
    expect(a_containsDuplicates([1, 2, 3, 1])).toBeTruthy();
  });
});
