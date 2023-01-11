import {n_is} from './is';

describe('TypeHelper', () => {
  it('n_is', () => {
    expect(n_is('true')).toBeFalsy();
    expect(n_is('false')).toBeFalsy();
    expect(n_is('asdf0000')).toBeFalsy();
    expect(n_is('001212asdfasd2342')).toBeFalsy();
    expect(n_is('123')).toBeFalsy();
    expect(n_is('-12')).toBeFalsy();
    expect(n_is('0.00000002323')).toBeFalsy();
    expect(n_is('121212.00000002323')).toBeFalsy();
    expect(n_is('00000.0000')).toBeFalsy();
    expect(n_is(0)).toBeTruthy();
    expect(n_is(1000.1)).toBeTruthy();
    expect(n_is(-1)).toBeTruthy();
    expect(n_is(Number.MAX_SAFE_INTEGER)).toBeTruthy();
    expect(n_is(Number.MAX_SAFE_INTEGER + 1)).toBeTruthy();
  });
});
