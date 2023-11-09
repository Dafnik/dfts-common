import { n_from } from './from';

describe('number from', () => {
  it('null, undefined and number', () => {
    expect(n_from(null)).toBe(Number.MAX_SAFE_INTEGER);
    expect(n_from(undefined)).toBe(Number.MAX_SAFE_INTEGER);
    expect(n_from(12)).toBe(12);
  });

  it('string', () => {
    expect(n_from('1')).toBe(1);
    expect(n_from('1')).toBeDefined();
    expect(n_from('120000')).toBe(120000);
    expect(n_from('123.12')).toBe(123.12);
    expect(n_from('0.00000012')).toBe(0.00000012);
  });

  it('boolean', () => {
    expect(n_from(true)).toBeDefined();
    expect(n_from(true)).toBe(1);
    expect(n_from(false)).toBe(0);
  });
});
