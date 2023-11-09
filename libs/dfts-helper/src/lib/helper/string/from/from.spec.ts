import { s_from } from './from';

describe('string from', () => {
  it('null, undefined and string', () => {
    expect(s_from(null)).toBe('');
    expect(s_from(undefined)).toBe('');
    expect(s_from('irgendwas')).toBe('irgendwas');
  });

  it('string', () => {
    expect(s_from(1)).toBe('1');
    expect(s_from(120000)).toBe('120000');
    expect(s_from(123.12)).toBe('123.12');
    expect(s_from(0.00000012)).toBe('1.2e-7');
    expect(s_from(0.000012)).toBe('0.000012');
  });

  it('boolean', () => {
    expect(s_from(true)).toBe('true');
    expect(s_from(false)).toBe('false');
  });
});
