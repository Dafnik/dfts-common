import {s_chunks} from './chunk';

describe('chunk', () => {
  it('toChunks', () => {
    expect(s_chunks('', 10).length).toEqual(0);
    expect(s_chunks('hello world', 5)).toEqual(['hello', 'world']);
    expect(s_chunks('the quick brown fox', 10)).toEqual(['the quick', 'brown fox']);
    expect(s_chunks('hello world', 100)).toEqual(['hello world']);
    expect(s_chunks('the quick brown fox', 1000)).toEqual(['the quick brown fox']);
    expect(s_chunks('    ', 10)).toEqual([]);
    expect(s_chunks('\t\t\t\t', 5)).toEqual([]);
    expect(s_chunks('  hello world  ', 5)).toEqual(['hello', 'world']);
    expect(s_chunks('  the quick brown fox   ', 10)).toEqual(['the quick', 'brown fox']);
    expect(s_chunks('hello   world', 5)).toEqual(['hello', 'world']);
    expect(s_chunks('the   quick   brown   fox', 10)).toEqual(['the quick', 'brown fox']);
    expect(s_chunks('the quick brown fox?', 10)).toEqual(['the quick', 'brown fox?']);
  });
});
