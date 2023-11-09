import { a_forEachIfAbsent } from './for-each-if-absent';

describe('for-each-if-absent', () => {
  it('should execute', () => {
    a_forEachIfAbsent(
      ['abc', 'bcc', 'cdf', 'xyz'],
      (value) => {
        expect(value).toEqual('hjk');
      },
      'hjk',
    );
  });
  it('should not execute', () => {
    a_forEachIfAbsent(
      ['abc', 'bcc', 'cdf', 'xyz'],
      (value) => {
        // Should never be executed
        expect(value).toEqual('abc');
      },
      'xyz',
    );
  });
});
