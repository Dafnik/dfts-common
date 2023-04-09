import {UndefinedOrNullOr} from '../../types.js';

export class StringHelper {
  private static hasNumbersInStringRegex = new RegExp(/\d/);
  private static hasOnlyLettersInStringRegex = new RegExp(/^[a-zA-Z]+$/);

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
}
