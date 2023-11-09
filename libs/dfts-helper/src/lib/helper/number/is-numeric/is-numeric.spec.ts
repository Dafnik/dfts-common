import { n_isNumeric } from './is-numeric';

describe('TypeHelper', () => {
  it('n_isNumeric', () => {
    expect(n_isNumeric('true')).toBeFalsy();
    expect(n_isNumeric('false')).toBeFalsy();
    expect(n_isNumeric('asdf0000')).toBeFalsy();
    expect(n_isNumeric('001212asdfasd2342')).toBeTruthy();
    expect(n_isNumeric('123')).toBeTruthy();
    expect(n_isNumeric('-12')).toBeTruthy();
    expect(n_isNumeric('0.00000002323')).toBeTruthy();
    expect(n_isNumeric('121212.00000002323')).toBeTruthy();
    expect(n_isNumeric('00000.0000')).toBeTruthy();
    expect(n_isNumeric(2048)).toBeTruthy();
    expect(n_isNumeric(true)).toBeFalsy();
  });
});
