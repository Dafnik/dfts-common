const lowerCaseLetters = 'abcdefghijklmnopqrstuvwxyz';
const upperCaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const numberLetters = '0123456789';
const specialCharacterLetters = '_-#+*~&?!=';

/**
 * Returns a random string containing a-z,A-Z
 * @param {number} length Length of the random string
 * @param {{containsNumbers?: boolean, containsSpecialCharacters?: boolean, specialCharactersSet?: s_generate, containsLetters?: boolean, containsLowerCaseLetters?: boolean, containsUpperCaseLetters?: boolean}} options options object
 * @description <code>containsNumbers</code> - default <code>false</code>, used to determine if the random string should contain numbers
 * @description <code>containsSpecialCharacters</code> - default <code>false</code>, used to determine if the random string should contain special characters
 * @description <code>specialCharactersSet</code> - default "<code>_-#+*~&?!=</code>", used to replace the default set
 * @description <code>containsLetters</code> default <code>true</code>, used to determine if the random string should contain letters
 * @description <code>containsLowerCaseLetters</code> default <code>true</code>, used to determine if the random string should contain lowercase letters
 * @description <code>containsUpperCaseLetters</code> default <code>true</code>, used to determine if the random string should contain UPPERCASE letters
 * @return string
 */
export function s_generate(
  length: number,
  options?: {
    containsNumbers?: boolean;
    containsSpecialCharacters?: boolean;
    specialCharactersSet?: string;
    containsLetters?: boolean;
    containsLowerCaseLetters?: boolean;
    containsUpperCaseLetters?: boolean;
  },
): string {
  let characters = lowerCaseLetters + upperCaseLetters;
  if (options?.containsLetters != undefined && !options.containsLetters) {
    characters = '';
  } else {
    if (options?.containsLowerCaseLetters != undefined && !options.containsLowerCaseLetters) {
      characters.replace(lowerCaseLetters, '');
    }
    if (options?.containsUpperCaseLetters != undefined && !options.containsUpperCaseLetters) {
      characters.replace(upperCaseLetters, '');
    }
  }

  if (options?.containsNumbers != undefined && options.containsNumbers) {
    characters += numberLetters;
  }
  if (options?.containsSpecialCharacters != undefined && options.containsSpecialCharacters) {
    if (options.specialCharactersSet != null) {
      characters += options.specialCharactersSet;
    } else {
      characters += specialCharacterLetters;
    }
  }
  const charactersLength = characters.length;
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
