import {UndefinedOrNullOr} from '../../types';
import {isNoUrl, isUrl} from './url';
import {isEmail, isNoEmail} from './email';
import {lowerCaseExceptFirstLetters, upperCaseFirstLetter} from './transformers';
import {cut} from './cut';
import {truncate} from './truncate';
import {stripWhitespace} from './strip-whitespace';

export class StringHelper {
  private static hasNumbersInStringRegex = new RegExp(/\d/);
  private static hasOnlyLettersInStringRegex = new RegExp(/^[a-zA-Z]+$/);

  /**
   * @deprecated
   * Returns <code>true</code> if the given string is an url, <code>false</code> if not
   * @param {string} url
   * @return boolean
   */
  static isUrl = (url?: UndefinedOrNullOr<string>): boolean => isUrl(url);

  /**
   * @deprecated
   * Returns <code>false</code> if the given string is an url, <code>true</code> if not
   * @param {string} url
   * @return boolean
   */
  static isNoUrl = (url?: UndefinedOrNullOr<string>): boolean => isNoUrl(url);

  /**
   * @deprecated
   * Returns <code>true</code> if the given string is an email, <code>false</code> if not
   * @param {string} email
   * @return boolean
   */
  static isEmail = (email: UndefinedOrNullOr<string>): boolean => isEmail(email);

  /**
   * @deprecated
   * Returns <code>false</code> if the given string is an email, <code>true</code> if not
   * @param {string} email
   * @return boolean
   */
  static isNoEmail = (email: UndefinedOrNullOr<string>): boolean => isNoEmail(email);

  /**
   * Returns <code>true</code> if the given text contains no numbers, <code>false</code> if not
   * @param {string} text
   * @return boolean
   */
  static hasNoNumbersInString = (text: UndefinedOrNullOr<string>): boolean => !this.hasNumbersInStringRegex.test(text ?? '');

  /**
   * Returns <code>true</code> if the given text contains numbers, <code>false</code> if not
   * @param {string} text
   * @return boolean
   */
  static hasNumbersInString = (text: UndefinedOrNullOr<string>): boolean => this.hasNumbersInStringRegex.test(text ?? '');

  /**
   * Returns <code>true</code> if the given text contains only a-zA-Z, <code>false</code> if it also contains special characters or numbers
   * @param {string} text
   * @return boolean
   */
  static hasOnlyLettersInString = (text: UndefinedOrNullOr<string>): boolean => this.hasOnlyLettersInStringRegex.test(text ?? '');

  /**
   * Returns <code>true</code> if the given text contains not only a-zA-Z, <code>false</code> if it contains only a-zA-Z
   * @param {string} text
   * @return boolean
   */
  static hasNotOnlyLettersInString = (text: UndefinedOrNullOr<string>): boolean => !this.hasOnlyLettersInStringRegex.test(text ?? '');

  /**
   * @deprecated
   * @param text
   */
  static stripWhitespace = (text: UndefinedOrNullOr<string>): string => stripWhitespace(text);

  /**
   * @deprecated
   * @param text
   */
  static upperCaseFirstLetter = (text: UndefinedOrNullOr<string>): string => upperCaseFirstLetter(text);

  /**
   * @deprecated
   * @param text
   */
  static lowerCaseExceptFirstLetters = (text: UndefinedOrNullOr<string>): string => lowerCaseExceptFirstLetters(text);

  /**
   * @deprecated
   * Returns the whole text if the length does not exceed the maxLength, else the text will be sliced and a suffix will be added
   * @param {string} text The text to check for slicing
   * @param {number} maxLength Maximal length of the text
   * @param {string|null|undefined} suffix Suffix to add if text length exceeds the <code>maxLength</code>, default <code>'...'</code>; Set to <code>null</code> to disable suffix.
   * @return string
   */
  static cut(text: UndefinedOrNullOr<string>, maxLength = 10, suffix: UndefinedOrNullOr<string> = '...'): string {
    return cut(text, maxLength, suffix);
  }

  /**
   * @deprecated
   * Returns the whole text if the word count does not exceed <code>maxWords</code>, else the text will be truncated and a suffic will be added
   * @param {string} text
   * @param {number} maxWords
   * @param {string|null|undefined} suffix
   * @return string
   */
  static truncate(text: UndefinedOrNullOr<string>, maxWords = 10, suffix: UndefinedOrNullOr<string> = '...'): string {
    return truncate(text, maxWords, suffix);
  }

  /**
   * Returns any array of chunks containing the split text
   * @param {string} text
   * @param {number} chunkLength Chunk length
   * @return string[]
   */
  static toChunks(text: string, chunkLength: number): string[] {
    const input = text.trim().split(' ');
    const output: string[] = [];
    let currentChunk = '';
    for (const word of input) {
      const temp = `${currentChunk} ${word}`.trim();
      if (temp.length <= chunkLength) {
        currentChunk = temp;
      } else {
        output.push(currentChunk);
        currentChunk = word;
      }
    }
    if (currentChunk) {
      output.push(currentChunk);
    }
    return output;
  }
}
