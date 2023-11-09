import { b_is } from './is';

describe('TypeHelper', () => {
  it('boolean', () => {
    expect(b_is('true')).toBeFalsy();
    expect(b_is('false')).toBeFalsy();
    expect(b_is(true)).toBeTruthy();
    expect(b_is(false)).toBeTruthy();
    const test = true;
    const test1 = false;
    expect(b_is(test)).toBeTruthy();
    expect(b_is(test1)).toBeTruthy();
  });
});
