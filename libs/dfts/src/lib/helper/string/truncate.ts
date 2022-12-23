import {UndefinedOrNullOr} from '../../types';

/**
 * Returns the whole text if the word count does not exceed <code>maxWords</code>, else the text will be truncated and a suffix will be added
 * @param {string} text
 * @param {number} maxWords
 * @param {string|null|undefined} suffix
 * @return string
 */
export const s_truncate = (text: UndefinedOrNullOr<string>, maxWords = 10, suffix: UndefinedOrNullOr<string> = '...'): string => {
  if (!text) {
    return '';
  }
  const splitted = text.split(' ');
  if (splitted.length <= maxWords) {
    return text;
  }
  return splitted.splice(0, maxWords).join(' ') + suffix;
};
