import {s_isNoUrl, s_isUrl} from './url';

describe('url', () => {
  it('isUrl', () => {
    expect(s_isUrl('http://ab.at')).toBeTruthy();
    expect(s_isUrl('https://datepoll.org')).toBeTruthy();
    expect(s_isUrl('datepollsystems.org')).toBeTruthy();
    expect(s_isUrl('datepollsystemsorg')).toBeFalsy();
    expect(s_isUrl(':datepollsy.stemsorg')).toBeFalsy();
    expect(s_isUrl('httpdatepollsy.stemsorg')).toBeTruthy();
    expect(s_isUrl('httpsdatepollsy.stemsorg')).toBeTruthy();
    expect(s_isUrl('httpsdatepollsy:stemsorg')).toBeFalsy();
    expect(s_isUrl('httpdatepollsy:stemsorg')).toBeFalsy();
    expect(s_isUrl('/httpdatepollsy.stemsorg')).toBeFalsy();
    expect(s_isUrl('/httpsdatepollsy.stemsorg')).toBeFalsy();
    expect(s_isUrl('/httpsdatepollsy:stemsorg')).toBeFalsy();
    expect(s_isUrl('/httpdatepollsy:stemsorg')).toBeFalsy();
    expect(s_isUrl('/httpdatepollsy.stemsorg:')).toBeFalsy();
    expect(s_isUrl('/httpsdatepollsy.stemsorg:')).toBeFalsy();
    expect(s_isUrl('/httpsdatepollsy:stemsorg:')).toBeFalsy();
    expect(s_isUrl('/httpdatepollsy:stemsorg:')).toBeFalsy();
    expect(s_isUrl('http://a.at')).toBeTruthy();
  });
  it('isNoUrl', () => {
    expect(s_isNoUrl('http://ab.at')).toBeFalsy();
    expect(s_isNoUrl('https://datepoll.org')).toBeFalsy();
    expect(s_isNoUrl('datepollsystems.org')).toBeFalsy();
    expect(s_isNoUrl('httpdatepollsy.stemsorg')).toBeFalsy();
    expect(s_isNoUrl('httpsdatepollsy.stemsorg')).toBeFalsy();
    expect(s_isNoUrl('http://a.at')).toBeFalsy();
    expect(s_isNoUrl('datepollsystemsorg')).toBeTruthy();
    expect(s_isNoUrl(':datepollsy.stemsorg')).toBeTruthy();
    expect(s_isNoUrl('httpsdatepollsy:stemsorg')).toBeTruthy();
    expect(s_isNoUrl('httpdatepollsy:stemsorg')).toBeTruthy();
    expect(s_isNoUrl('/httpdatepollsy.stemsorg')).toBeTruthy();
    expect(s_isNoUrl('/httpsdatepollsy.stemsorg')).toBeTruthy();
    expect(s_isNoUrl('/httpsdatepollsy:stemsorg')).toBeTruthy();
    expect(s_isNoUrl('/httpdatepollsy:stemsorg')).toBeTruthy();
    expect(s_isNoUrl('/httpdatepollsy.stemsorg:')).toBeTruthy();
    expect(s_isNoUrl('/httpsdatepollsy.stemsorg:')).toBeTruthy();
    expect(s_isNoUrl('/httpsdatepollsy:stemsorg:')).toBeTruthy();
    expect(s_isNoUrl('/httpdatepollsy:stemsorg:')).toBeTruthy();
  });
});
