import {s_countWords} from './count-words';

describe('wordsCount', () => {
  it('should count the number of words in a string', () => {
    expect(s_countWords('This is a piece of text.')).toBe(6);
  });

  it('should ignore non-word characters', () => {
    expect(s_countWords('This is a piece of text!')).toBe(6);
    expect(s_countWords('This is a piece of text?')).toBe(6);
  });

  it('should handle empty strings', () => {
    expect(s_countWords('')).toBe(0);
  });
});
