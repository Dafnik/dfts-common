import { StringHelper } from "./_string";

describe('StringHelper', () => {
  it('hasNumbersInString', () => {
    expect(StringHelper.hasNumbersInString('true')).toBeFalsy();
    expect(StringHelper.hasNumbersInString('false')).toBeFalsy();
    expect(
      StringHelper.hasNumbersInString('lajhsdlkfqwejröqjkafkjöaskdjfvövjaölwekjörqqwer!"§$!"§$%§$%&"$§"§!"§$&/%&/$(&/(=&/(%$&/§$'),
    ).toBeFalsy();
    expect(StringHelper.hasNumbersInString('asdf0000')).toBeTruthy();
    expect(StringHelper.hasNumbersInString('001212asdfasd2342')).toBeTruthy();
    expect(StringHelper.hasNumbersInString('123')).toBeTruthy();
    expect(StringHelper.hasNumbersInString('-12')).toBeTruthy();
    expect(StringHelper.hasNumbersInString('0.00000002323')).toBeTruthy();
    expect(StringHelper.hasNumbersInString('121212.00000002323')).toBeTruthy();
    expect(StringHelper.hasNumbersInString('00000.0000')).toBeTruthy();
  });
  it('hasNoNumbersInString', () => {
    expect(StringHelper.hasNoNumbersInString('true')).toBeTruthy();
    expect(StringHelper.hasNoNumbersInString('false')).toBeTruthy();
    expect(
      StringHelper.hasNoNumbersInString('lajhsdlkfqwejröqjkafkjöaskdjfvövjaölwekjörqqwer!"§$!"§$%§$%&"$§"§!"§$&/%&/$(&/(=&/(%$&/§$'),
    ).toBeTruthy();
    expect(StringHelper.hasNoNumbersInString('asdf0000')).toBeFalsy();
    expect(StringHelper.hasNoNumbersInString('001212asdfasd2342')).toBeFalsy();
    expect(StringHelper.hasNoNumbersInString('123')).toBeFalsy();
    expect(StringHelper.hasNoNumbersInString('-12')).toBeFalsy();
    expect(StringHelper.hasNoNumbersInString('0.00000002323')).toBeFalsy();
    expect(StringHelper.hasNoNumbersInString('121212.00000002323')).toBeFalsy();
    expect(StringHelper.hasNoNumbersInString('00000.0000')).toBeFalsy();
  });
  it('hasOnlyLettersInString', () => {
    expect(StringHelper.hasOnlyLettersInString('true')).toBeTruthy();
    expect(StringHelper.hasOnlyLettersInString('false')).toBeTruthy();
    expect(StringHelper.hasOnlyLettersInString('false.')).toBeFalsy();
    expect(StringHelper.hasOnlyLettersInString('false-')).toBeFalsy();
    expect(StringHelper.hasOnlyLettersInString('false+')).toBeFalsy();
    expect(StringHelper.hasOnlyLettersInString('false#')).toBeFalsy();
    expect(
      StringHelper.hasOnlyLettersInString('lajhsdlkfqwejröqjkafkjöaskdjfvövjaölwekjörqqwer!"§$!"§$%§$%&"$§"§!"§$&/%&/$(&/(=&/(%$&/§$--..'),
    ).toBeFalsy();
    expect(StringHelper.hasOnlyLettersInString('asdf0000')).toBeFalsy();
    expect(StringHelper.hasOnlyLettersInString('001212asdfasd2342')).toBeFalsy();
    expect(StringHelper.hasOnlyLettersInString('123')).toBeFalsy();
    expect(StringHelper.hasOnlyLettersInString('-12')).toBeFalsy();
    expect(StringHelper.hasOnlyLettersInString('0.00000002323')).toBeFalsy();
    expect(StringHelper.hasOnlyLettersInString('121212.00000002323')).toBeFalsy();
    expect(StringHelper.hasOnlyLettersInString('00000.0000')).toBeFalsy();
  });
  it('hasNotOnlyLettersInString', () => {
    expect(StringHelper.hasNotOnlyLettersInString('true')).toBeFalsy();
    expect(StringHelper.hasNotOnlyLettersInString('false')).toBeFalsy();
    expect(StringHelper.hasNotOnlyLettersInString('false.')).toBeTruthy();
    expect(StringHelper.hasNotOnlyLettersInString('false-')).toBeTruthy();
    expect(StringHelper.hasNotOnlyLettersInString('false+')).toBeTruthy();
    expect(StringHelper.hasNotOnlyLettersInString('false#')).toBeTruthy();
    expect(
      StringHelper.hasNotOnlyLettersInString(
        'lajhsdlkfqwejröqjkafkjöaskdjfvövjaölwekjörqqwer!"§$!"§$%§$%&"$§"§!"§$&/%&/$(&/(=&/(%$&/§$--..',
      ),
    ).toBeTruthy();
    expect(StringHelper.hasNotOnlyLettersInString('asdf0000')).toBeTruthy();
    expect(StringHelper.hasNotOnlyLettersInString('001212asdfasd2342')).toBeTruthy();
    expect(StringHelper.hasNotOnlyLettersInString('123')).toBeTruthy();
    expect(StringHelper.hasNotOnlyLettersInString('-12')).toBeTruthy();
    expect(StringHelper.hasNotOnlyLettersInString('0.00000002323')).toBeTruthy();
    expect(StringHelper.hasNotOnlyLettersInString('121212.00000002323')).toBeTruthy();
    expect(StringHelper.hasNotOnlyLettersInString('00000.0000')).toBeTruthy();
  });
});
