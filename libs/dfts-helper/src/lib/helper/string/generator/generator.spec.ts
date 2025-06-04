import { a_containsDuplicates } from '../../array/contains-duplicates/contains-duplicates';
import { StringHelper } from '../_string';
import { s_generate } from './generator';

describe('string generator', () => {
  it('randomness string', () => {
    const test = [];
    for (let i = 0; i < 10000; i++) {
      test.push(s_generate(10));
    }
    expect(a_containsDuplicates(test)).toBeFalsy();
  });
  it('randomness string with special characters', () => {
    const test = [];
    for (let i = 0; i < 10000; i++) {
      test.push(s_generate(10, { containsNumbers: true, containsSpecialCharacters: true }));
    }
    expect(a_containsDuplicates(test)).toBeFalsy();
  });
  it('randomness string without numbers, with special characters', () => {
    const test = [];
    for (let i = 0; i < 10000; i++) {
      test.push(s_generate(10, { containsNumbers: false, containsSpecialCharacters: true }));
    }
    expect(a_containsDuplicates(test)).toBeFalsy();
  });
  it('expect default randomString to have letters and no numbers', () => {
    for (let i = 0; i < 100; i++) {
      const val = s_generate(70);
      expect(StringHelper.hasNoNumbersInString(val)).toBeTruthy();
      expect(StringHelper.hasOnlyLettersInString(val)).toBeTruthy();
    }
  });
  it('expect random string to have letters and no numbers', () => {
    for (let i = 0; i < 100; i++) {
      const val = s_generate(70, { containsNumbers: false });
      expect(StringHelper.hasNoNumbersInString(val)).toBeTruthy();
      expect(StringHelper.hasOnlyLettersInString(val)).toBeTruthy();
      expect(StringHelper.hasNotOnlyLettersInString(val)).toBeFalsy();
      expect(StringHelper.hasNoNumbersInString(val)).toBeTruthy();
      expect(StringHelper.hasOnlyLettersInString(val)).toBeTruthy();
      expect(StringHelper.hasNotOnlyLettersInString(val)).toBeFalsy();
    }
  });
  it('expect random string to have letters and no numbers but special characters', () => {
    for (let i = 0; i < 100; i++) {
      const val = s_generate(70, { containsNumbers: false, containsSpecialCharacters: true });
      expect(StringHelper.hasNoNumbersInString(val)).toBeTruthy();
      expect(StringHelper.hasOnlyLettersInString(val)).toBeFalsy();
      expect(StringHelper.hasNotOnlyLettersInString(val)).toBeTruthy();
    }
  });
  it('expect random string to have no letters but numbers and special characters', () => {
    for (let i = 0; i < 100; i++) {
      const val = s_generate(80, {
        containsNumbers: true,
        containsSpecialCharacters: true,
        containsLetters: false,
      });
      expect(StringHelper.hasNumbersInString(val)).toBeTruthy();
      expect(StringHelper.hasNotOnlyLettersInString(val)).toBeTruthy();
    }
  });
  it('expect random string to have letters, no numbers and no special characters with config', () => {
    for (let i = 0; i < 100; i++) {
      const val = s_generate(70, {
        containsNumbers: false,
        containsSpecialCharacters: false,
        containsLetters: true,
      });
      expect(StringHelper.hasNoNumbersInString(val)).toBeTruthy();
      expect(StringHelper.hasOnlyLettersInString(val)).toBeTruthy();
    }
  });
  it('expect random string to have letters and numbers and special characters', () => {
    for (let i = 0; i < 100; i++) {
      const val = s_generate(70, {
        containsNumbers: true,
        containsSpecialCharacters: true,
        specialCharactersSet: undefined,
      });
      expect(StringHelper.hasNumbersInString(val)).toBeTruthy();
      expect(StringHelper.hasNotOnlyLettersInString(val)).toBeTruthy();
    }
  });
  it('expect random string to have no letters and no numbers but special characters with special special character set', () => {
    for (let i = 0; i < 100; i++) {
      const val = s_generate(2, {
        containsNumbers: false,
        containsLetters: false,
        specialCharactersSet: ':',
        containsSpecialCharacters: true,
      });
      expect(StringHelper.hasNoNumbersInString(val)).toBeTruthy();
      expect(StringHelper.hasNotOnlyLettersInString(val)).toBeTruthy();
      expect(val.length).toBe(2);
      expect(val.includes(':')).toBeTruthy();
    }
  });
});
