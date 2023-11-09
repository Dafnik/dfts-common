import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { provideDfxTranslate } from '../../translate.provider';
import { TRANSLATE_ASSETS_PATH, withAssetsPath } from './assets-path';
import { withRememberLanguage } from '../remember-language/remember-language';
import { of } from 'rxjs';
import { TranslateStore } from '../../service/translate.store';
import { withDefaultLanguage } from '../default-language/default-language';

describe('assets-path feature', () => {
  beforeAll(() => localStorage.clear());

  it('should inject default value', () => {
    void TestBed.configureTestingModule({
      providers: [provideDfxTranslate(withRememberLanguage(false))],
    }).compileComponents();

    expect(TestBed.inject(TRANSLATE_ASSETS_PATH)).toBe('assets/i18n/');
  });

  it('should inject configured value', () => {
    void TestBed.configureTestingModule({
      providers: [provideDfxTranslate(withRememberLanguage(false), withAssetsPath('test/test/test'))],
    }).compileComponents();

    expect(TestBed.inject(TRANSLATE_ASSETS_PATH)).toBe('test/test/test');
  });

  it('should use default value in code', () => {
    void TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [provideDfxTranslate(withRememberLanguage(false))],
    }).compileComponents();

    const http = TestBed.inject(HttpClient);
    const store = TestBed.inject(TranslateStore);

    const httpGetSpy = jest.spyOn(http, 'get').mockImplementation(() => of({}));
    expect(subscribeSpyTo(store.translations$).getLastValue()).toStrictEqual({});
    expect(httpGetSpy).toHaveBeenCalledWith('assets/i18n/en.json');
    expect(httpGetSpy).not.toHaveBeenCalledWith('assets/i18n/de.json');
    expect(httpGetSpy).not.toHaveBeenCalledWith('asdf/i18n/en.json');
  });

  it('should use configured value in code', () => {
    void TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [provideDfxTranslate(withRememberLanguage(false), withAssetsPath('customized/i18n/'))],
    }).compileComponents();

    const http = TestBed.inject(HttpClient);
    const store = TestBed.inject(TranslateStore);

    const httpGetSpy = jest.spyOn(http, 'get').mockImplementation(() => of({}));
    expect(subscribeSpyTo(store.translations$).getLastValue()).toStrictEqual({});
    expect(httpGetSpy).not.toHaveBeenCalledWith('assets/i18n/en.json');
    expect(httpGetSpy).not.toHaveBeenCalledWith('assets/i18n/de.json');
    expect(httpGetSpy).toHaveBeenCalledWith('customized/i18n/en.json');
  });

  it('should use configured value with different default language and assets path', () => {
    void TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [provideDfxTranslate(withRememberLanguage(false), withAssetsPath('customized/i18n/'), withDefaultLanguage('de'))],
    }).compileComponents();

    const http = TestBed.inject(HttpClient);
    const store = TestBed.inject(TranslateStore);

    const httpGetSpy = jest.spyOn(http, 'get').mockImplementation(() => of({}));
    expect(subscribeSpyTo(store.translations$).getLastValue()).toStrictEqual({});
    expect(httpGetSpy).not.toHaveBeenCalledWith('assets/i18n/de.json');
    expect(httpGetSpy).not.toHaveBeenCalledWith('customized/i18n/en.json');
    expect(httpGetSpy).toHaveBeenCalledWith('customized/i18n/de.json');
  });
});
