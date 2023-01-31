import {TestBed} from '@angular/core/testing';
import {provideDfxTranslate} from '../../translate.provider';
import {withRememberLanguage} from '../remember-language/remember-language';
import {TRANSLATE_DEFAULT_LANGUAGE, withDefaultLanguage} from './default-language';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {HttpClient} from '@angular/common/http';
import {TranslateStore} from '../../service/translate.store';
import {of} from 'rxjs';
import {subscribeSpyTo} from '@hirez_io/observer-spy';

describe('default-language feature', () => {
  beforeAll(() => localStorage.clear());

  it('should inject default value', () => {
    void TestBed.configureTestingModule({
      providers: [provideDfxTranslate(withRememberLanguage(false))],
    }).compileComponents();

    expect(TestBed.inject(TRANSLATE_DEFAULT_LANGUAGE)).toBe('en');
  });

  it('should inject configured value', () => {
    void TestBed.configureTestingModule({
      providers: [provideDfxTranslate(withRememberLanguage(false), withDefaultLanguage('de'))],
    }).compileComponents();

    expect(TestBed.inject(TRANSLATE_DEFAULT_LANGUAGE)).toBe('de');
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
    expect(httpGetSpy).not.toHaveBeenCalledWith('assets/i18n/es.json');
  });

  it('should use configured value in code', () => {
    void TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [provideDfxTranslate(withRememberLanguage(false), withDefaultLanguage('de'))],
    }).compileComponents();

    const http = TestBed.inject(HttpClient);
    const store = TestBed.inject(TranslateStore);

    const httpGetSpy = jest.spyOn(http, 'get').mockImplementation(() => of({}));
    expect(subscribeSpyTo(store.translations$).getLastValue()).toStrictEqual({});
    expect(httpGetSpy).toHaveBeenCalledWith('assets/i18n/de.json');
    expect(httpGetSpy).not.toHaveBeenCalledWith('assets/i18n/en.json');
    expect(httpGetSpy).not.toHaveBeenCalledWith('assets/i18n/es.json');
  });
});
