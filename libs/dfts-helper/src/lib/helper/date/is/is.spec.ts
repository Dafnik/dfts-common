import { d_is } from './is';

describe('TypeHelper', () => {
  it('d_is', () => {
    expect(d_is('2020-12-12')).toBeFalsy();
    expect(d_is('12:12')).toBeFalsy();
    expect(d_is(1)).toBeFalsy();
    expect(d_is('test')).toBeFalsy();
    expect(d_is(true)).toBeFalsy();
    expect(d_is(['test', 'test'])).toBeFalsy();
    expect(d_is(new Date())).toBeTruthy();
    expect(d_is(new Date('2020-12-12'))).toBeTruthy();
    const test = new Date('2019-12-12');
    expect(d_is(test)).toBeTruthy();
  });
});
