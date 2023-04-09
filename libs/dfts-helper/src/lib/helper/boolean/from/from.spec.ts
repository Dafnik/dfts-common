import {b_from} from './from.js';

describe('boolean from', () => {
  it('null, undefined and boolean', () => {
    expect(b_from(true)).toBeTruthy();
    expect(b_from(false)).toBeFalsy();

    expect(b_from(null)).toBeFalsy();
    expect(b_from(undefined)).toBeFalsy();
  });

  it('string', () => {
    expect(b_from('true')).toBeTruthy();
    expect(b_from('true')).toBeDefined();
    expect(b_from('false')).toBeFalsy();
    expect(b_from('asdfasdfasdf')).toBeFalsy();
    expect(b_from('dddddd')).toBeFalsy();
  });

  it('number', () => {
    expect(b_from(1)).toBeDefined();
    expect(b_from(1)).toBeTruthy();
    expect(b_from(12)).toBeFalsy();
    expect(b_from(0)).toBeFalsy();
    expect(b_from(-12)).toBeFalsy();
    expect(b_from(12.213)).toBeFalsy();
    expect(b_from(-1)).toBeFalsy();
  });
});
