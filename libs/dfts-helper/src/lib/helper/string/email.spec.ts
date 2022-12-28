import {s_isEmail, s_isNoEmail} from './email';

describe('email', () => {
  it('isEmail', () => {
    expect(s_isEmail('test@test.at')).toBeTruthy();
    expect(s_isEmail('keineemail')).toBeFalsy();
    expect(s_isEmail('test.at')).toBeFalsy();
    expect(s_isEmail('test@testt')).toBeFalsy();
    expect(s_isEmail('test@.at')).toBeFalsy();
  });

  it('isNoEmail', () => {
    expect(s_isNoEmail('test@test.at')).toBeFalsy();
    expect(s_isNoEmail('keineemail')).toBeTruthy();
    expect(s_isNoEmail('test.at')).toBeTruthy();
    expect(s_isNoEmail('test@testt')).toBeTruthy();
    expect(s_isNoEmail('test@.at')).toBeTruthy();
  });
});
