import {a_forEachIfPresent} from './for-each-if-present.js';

describe('for-each-if-present', () => {
  it('should execute', () => {
    a_forEachIfPresent(
      ['abc', 'bcc', 'cdf', 'xyz'],
      (value) => {
        expect(value).toEqual('xyz');
      },
      'xyz'
    );
  });
  it('should not execute', () => {
    a_forEachIfPresent(
      ['abc', 'bcc', 'cdf', 'xyz'],
      (value) => {
        // Should never be executed
        expect(value).toEqual('asdfasdfasdfasdf');
      },
      'hjk'
    );
  });
});
