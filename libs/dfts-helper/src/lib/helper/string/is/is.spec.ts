import { s_is } from '../is';

describe('TypeHelper', () => {
  it('s_is', () => {
    expect(s_is('true')).toBeTruthy();
    expect(s_is('false')).toBeTruthy();
    expect(s_is('asdf0000')).toBeTruthy();
    expect(s_is('001212asdfasd2342')).toBeTruthy();
    expect(s_is('123')).toBeTruthy();
    expect(s_is('-12')).toBeTruthy();
    expect(s_is('0.00000002323')).toBeTruthy();
    expect(s_is('121212.00000002323')).toBeTruthy();
    expect(s_is('00000.0000')).toBeTruthy();
  });
});
