import {s_generate} from './string/generator';
import {n_generate_float, n_generate_int} from './number/generator';

export enum RandomStringOptions {
  NUMBERS,
  SPECIAL_CHARACTERS,
  REMOVE_LETTERS,
  REMOVE_UPPERCASE_LETTERS,
  REMOVE_LOWERCASE_LETTERS,
}

export class Generator {
  /**
   * @deprecated
   * Returns a random string containing a-z,A-Z
   * @param {number} length Length of the random string
   * @param {RandomStringOptions} options Possible options of RandomStringOptions enum
   * @return string
   */
  static stringByOptions(length: number, ...options: RandomStringOptions[]): string {
    let containsNumbers = false;
    let containsSpecialCharacters = false;
    let containsLetters = true;
    let containsLowerCaseLetters = true;
    let containsUpperCaseLetters = true;
    for (const option of options) {
      switch (option) {
        case RandomStringOptions.NUMBERS:
          containsNumbers = true;
          break;
        case RandomStringOptions.SPECIAL_CHARACTERS:
          containsSpecialCharacters = true;
          break;
        case RandomStringOptions.REMOVE_LETTERS:
          containsLetters = false;
          break;
        case RandomStringOptions.REMOVE_LOWERCASE_LETTERS:
          containsLowerCaseLetters = false;
          break;
        case RandomStringOptions.REMOVE_UPPERCASE_LETTERS:
          containsUpperCaseLetters = false;
          break;
      }
    }
    return this.string(length, {
      containsNumbers: containsNumbers,
      containsSpecialCharacters: containsSpecialCharacters,
      containsLetters: containsLetters,
      containsUpperCaseLetters: containsUpperCaseLetters,
      containsLowerCaseLetters: containsLowerCaseLetters,
    });
  }

  /**
   * @deprecated
   * Returns a random string containing a-z,A-Z
   * @param {number} length Length of the random string
   * @param {{containsNumbers?: boolean, containsSpecialCharacters?: boolean, specialCharactersSet?: string, containsLetters?: boolean, containsLowerCaseLetters?: boolean, containsUpperCaseLetters?: boolean}} options options object
   * @description <code>containsNumbers</code> - default <code>false</code>, used to determine if the random string should contain numbers
   * @description <code>containsSpecialCharacters</code> - default <code>false</code>, used to determine if the random string should contain special characters
   * @description <code>specialCharactersSet</code> - default "<code>_-#+*~&?!=</code>", used to replace the default set
   * @description <code>containsLetters</code> default <code>true</code>, used to determine if the random string should contain letters
   * @description <code>containsLowerCaseLetters</code> default <code>true</code>, used to determine if the random string should contain lowercase letters
   * @description <code>containsUpperCaseLetters</code> default <code>true</code>, used to determine if the random string should contain UPPERCASE letters
   * @return string
   */
  static string(
    length: number,
    options?: {
      containsNumbers?: boolean;
      containsSpecialCharacters?: boolean;
      specialCharactersSet?: string;
      containsLetters?: boolean;
      containsLowerCaseLetters?: boolean;
      containsUpperCaseLetters?: boolean;
    }
  ): string {
    return s_generate(length, options);
  }

  /**
   * @deprecated
   * Returns a random integer number
   * @param {number} min Minimum number of random number
   * @param {number} max Maximum number of random number
   * @return number
   */
  static integer(min: number, max: number): number {
    return n_generate_int(min, max);
  }

  /**
   * @deprecated
   * Returns a random float number
   * @param {number} min Minimum number of random number
   * @param {number} max Maximum number of random number
   * @param {number} decimals Decimals of new random float
   * @return number
   */
  static float(min: number, max: number, decimals: number): number {
    return n_generate_float(min, max, decimals);
  }
}
