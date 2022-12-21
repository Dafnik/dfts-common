export enum RandomStringOptions {
  NUMBERS,
  SPECIAL_CHARACTERS,
  REMOVE_LETTERS,
  REMOVE_UPPERCASE_LETTERS,
  REMOVE_LOWERCASE_LETTERS,
}

export class Generator {
  static readonly lowerCaseLetters = 'abcdefghijklmnopqrstuvwxyz';
  static readonly upperCaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  static readonly numberLetters = '0123456789';
  static readonly specialCharacterLetters = '_-#+*~&?!=';

  /**
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
    let characters = this.lowerCaseLetters + this.upperCaseLetters;
    if (options?.containsLetters != undefined && !options.containsLetters) {
      characters = '';
    } else {
      if (options?.containsLowerCaseLetters != undefined && !options.containsLowerCaseLetters) {
        characters.replace(this.lowerCaseLetters, '');
      }
      if (options?.containsUpperCaseLetters != undefined && !options.containsUpperCaseLetters) {
        characters.replace(this.upperCaseLetters, '');
      }
    }

    if (options?.containsNumbers != undefined && options.containsNumbers) {
      characters += this.numberLetters;
    }
    if (options?.containsSpecialCharacters != undefined && options.containsSpecialCharacters) {
      if (options.specialCharactersSet != null) {
        characters += options.specialCharactersSet;
      } else {
        characters += this.specialCharacterLetters;
      }
    }
    const charactersLength = characters.length;
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  /**
   * Returns a random integer number
   * @param {number} min Minimum number of random number
   * @param {number} max Maximum number of random number
   * @return number
   */
  static integer(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  /**
   * Returns a random float number
   * @param {number} min Minimum number of random number
   * @param {number} max Maximum number of random number
   * @param {number} decimals Decimals of new random float
   * @return number
   */
  static float(min: number, max: number, decimals: number): number {
    const str = (Math.random() * (max - min) + min).toFixed(decimals);

    return parseFloat(str);
  }
}
