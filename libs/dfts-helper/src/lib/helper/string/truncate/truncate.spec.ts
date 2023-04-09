import {s_truncate} from './truncate';

describe('truncate', () => {
  it('truncate', () => {
    expect(s_truncate(null)).toBe('');
    expect(s_truncate(undefined)).toBe('');
    expect(s_truncate('hello world', 10)).toBe('hello world');
    expect(s_truncate('the quick brown fox', 20)).toBe('the quick brown fox');
    expect(s_truncate('hello world', 1)).toBe('hello...');
    expect(s_truncate('the quick brown fox', 2)).toBe('the quick...');
    expect(s_truncate('hello world', 1, '!')).toBe('hello!');
    expect(s_truncate('the quick brown fox', 2, '***')).toBe('the quick***');
    expect(s_truncate('hello world', 1, '')).toBe('hello');
    expect(s_truncate('the quick brown fox', 2, '')).toBe('the quick');
  });
});
