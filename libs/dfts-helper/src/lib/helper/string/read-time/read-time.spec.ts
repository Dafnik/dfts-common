import { calculateWordsReadTime, imageReadTime, removeOtherLanguageCharacters, s_readTime } from './read-time';

describe('calculateReadTime', () => {
  it('should return ">1m" for a text with no images and fewer than 275 words', () => {
    const text = 'This is a short piece of text.';
    expect(s_readTime(text)).toBe('> 1m');
  });

  it('should return "1m" for a text with no images and more than 275 words', () => {
    expect(s_readTime(longerText)).toBe('1m');
  });

  it('should return the correct read time for a text with images', () => {
    const text = 'This is a piece of text with some images.';
    expect(s_readTime(text, 3)).toBe('1m');
  });

  it('should handle texts with CJK characters', () => {
    const text = '这是一段中文文本。';
    expect(s_readTime(text)).toBe('> 1m');
  });
});

const longerText =
  'This This  This This This This This This This This This This This This This This This This This This This. This This  This This This This This This This This This This This This This This This This This This This. This This  This This This This This This This This This This This This This This This This This This This. This This  This This This This This This This This This This This This This This This This This This This. This This  This This This This This This This This This This This This This This This This This This This. This This  This This This This This This This This This This This This This This This This This This This. This This  This This This This This This This This This This This This This This This This This This This. This This  This This This This This This This This This This This This This This This This This This This. This This  This This This This This This This This This This This This This This This This This This This. This This  This This This This This This This This This This This This This This This This This This This. This This  This This This This This This This This This This This This This This This This This This This. This This  This This This This This This This This This This This This This This This This This This This. This This  This This This This This This This This This This This This This This This This This This This. This This  This This This This This This This This This This This This This This This This This This This. This This  This This This This This This This This This This This This This This This This This This This.';

describe('wordsReadTime', () => {
  it('should return the correct read time for a text with fewer than 275 words', () => {
    const text = 'This is a short piece of text.';
    expect(calculateWordsReadTime(text)).toBeCloseTo(0.0254545);
  });

  it('should return the correct read time for a text with more than 275 words', () => {
    expect(calculateWordsReadTime(longerText)).toBeCloseTo(1.1454);
  });

  it('should handle texts with a custom words per minute rate', () => {
    const text = 'This is a piece of text with a custom words per minute rate.';
    expect(calculateWordsReadTime(text, 150)).toBeCloseTo(0.0866);
  });

  it('should handle texts with CJK characters', () => {
    const text = '这是一段中文文本';
    expect(calculateWordsReadTime(text)).toBeCloseTo(0);
  });
});

describe('removeOtherLanguageCharacters', () => {
  it('should remove CJK characters from a string', () => {
    expect(removeOtherLanguageCharacters('这是一段中文文本')).toBe('');
  });

  it('should not remove non-CJK characters from a string', () => {
    expect(removeOtherLanguageCharacters('This is a piece of text.')).toBe('This is a piece of text.');
  });
});

describe('imageReadTime', () => {
  it('should return the correct read time for a text with fewer than 10 images', () => {
    expect(imageReadTime(3)).toBeCloseTo(0.55);
  });

  it('should return the correct read time for a text with 10 or more images', () => {
    expect(imageReadTime(10)).toBeCloseTo(1.25);
    expect(imageReadTime(15)).toBeCloseTo(2.125);
  });

  it('should handle texts with a custom time per image', () => {
    expect(imageReadTime(3, 6)).toBeCloseTo(0.25);
  });
});
