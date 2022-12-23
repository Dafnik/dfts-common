import {s_cut} from './cut';

describe('cut', () => {
  it('cutString', () => {
    expect(s_cut('DasIstEinTest', 5)).toBe('DasIs...');
    expect(s_cut('DasIstEinTest', 20)).toBe('DasIstEinTest');
    expect(s_cut('DasIstEinTest')).toBe('DasIstEinT...');
    expect(s_cut('DasIstEinTest', 5, null)).toBe('DasIs');
    expect(s_cut('DasIstEinTest', 5, '..')).toBe('DasIs..');
    expect(s_cut(null)).toBe('');
    expect(s_cut(undefined)).toBe('');
    expect(s_cut('hello', 10)).toBe('hello');
    expect(s_cut('goodbye', 20)).toBe('goodbye');
    expect(s_cut('hello world', 5)).toBe('hello...');
    expect(s_cut('the quick brown fox', 10)).toBe('the quick ...');
    expect(s_cut('hello world', 5, '!')).toBe('hello!');
    expect(s_cut('the quick brown fox', 10, '***')).toBe('the quick ***');
    expect(s_cut('hello world', 5, '')).toBe('hello');
    expect(s_cut('the quick brown fox', 10, '')).toBe('the quick ');
  });
});
