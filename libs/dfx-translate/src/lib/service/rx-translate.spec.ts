import {HttpClient} from '@angular/common/http';
import {TestBed} from '@angular/core/testing';
import {serviceStub, TRANSLATE$_FN, TRANSLATE_SET_LANGUAGE_FN} from '../test-helper';
import {provideDfxTranslate} from '../translate.provider';
import {subscribeSpyTo} from '@hirez_io/observer-spy';
import {TranslateStore} from './translate.store';
import {dfxTranslate$} from './rx-translate';
import {dfxTranslateSetLanguage} from './set-language';
import {dfxTranslateFn$, dfxTranslateSetLanguageFn, TRANSLATE_LOCALSTORAGE_KEY} from '../types';
import {TRANSLATE_DEFAULT_LANGUAGE} from '../features/default-language/default-language';
import {TRANSLATE_REMEMBER_LANGUAGE} from '../features/remember-language/remember-language';
import {
  TRANSLATE_AUTO_TRANSLATED_LANGUAGES,
  withAutoTranslatedLanguages,
} from '../features/auto-translated-languages/auto-translated-languages';

describe('dfxTranslate$', () => {
  let translateStore: TranslateStore;
  let translate: dfxTranslateFn$;
  let setLanguage: dfxTranslateSetLanguageFn;

  beforeEach(() => {
    localStorage.clear();

    void TestBed.configureTestingModule({
      providers: [
        {
          provide: HttpClient,
          useValue: serviceStub,
        },
        provideDfxTranslate(withAutoTranslatedLanguages(['de', 'es'])),
        {
          provide: TRANSLATE$_FN,
          useFactory: () => dfxTranslate$(),
        },
        {
          provide: TRANSLATE_SET_LANGUAGE_FN,
          useFactory: () => dfxTranslateSetLanguage(),
        },
      ],
    }).compileComponents();

    translateStore = TestBed.inject(TranslateStore);

    translate = TestBed.inject(TRANSLATE$_FN);
    setLanguage = TestBed.inject(TRANSLATE_SET_LANGUAGE_FN);
  });

  it('should use configured values', () => {
    expect(TestBed.inject(TRANSLATE_DEFAULT_LANGUAGE)).toBe('en');
    expect(TestBed.inject(TRANSLATE_AUTO_TRANSLATED_LANGUAGES).length).toBe(2);
    expect(TestBed.inject(TRANSLATE_REMEMBER_LANGUAGE)).toBeTruthy();

    expect(subscribeSpyTo(translateStore.selectedLanguage$).getLastValue()).toBe('en');
  });

  it('should language be defined', () => {
    expect(subscribeSpyTo(translateStore.translations$).getLastValue()).not.toBe({});
  });

  it('should auto-translated language be undefined', () => {
    expect(subscribeSpyTo(translateStore.autoGeneratedTranslations$).getLastValue()).toStrictEqual({});
  });

  it('should translate null & undefined', () => {
    expect(subscribeSpyTo(translate(null)).getLastValue()).toBe('');
    expect(subscribeSpyTo(translate(undefined)).getLastValue()).toBe('');
  });

  it('should translate not existing', () => {
    expect(subscribeSpyTo(translate('keyasdfasdf')).getLastValue()).toBe('keyasdfasdf');
  });

  it('should translate', () => {
    expect(subscribeSpyTo(translate('testkey1')).getLastValue()).toBe('testanswer1');
    expect(subscribeSpyTo(translate('testkey2')).getLastValue()).toBe('testanswer2');
  });

  it('should translate not auto', () => {
    expect(subscribeSpyTo(translate('testkey3')).getLastValue()).toBe('testanswer3');
    expect(subscribeSpyTo(translate('testkey4')).getLastValue()).toBe('testanswer4');
  });

  it('should translate auto', () => {
    setLanguage('de');
    expect(subscribeSpyTo(translate('testkey3')).getFirstValue()).toBe('testanswer3_DE_auto');
    expect(subscribeSpyTo(translate('testkey4')).getFirstValue()).toBe('testanswer4_DE_auto');
  });

  it('should translate changed language', () => {
    setLanguage('de');
    expect(subscribeSpyTo(translate('testkey1')).getLastValue()).toBe('testanswer1_DE');
    expect(subscribeSpyTo(translate('testkey2')).getLastValue()).toBe('testanswer2_DE');
  });

  it('set error language', () => {
    setLanguage('es');
    expect(subscribeSpyTo(translateStore.selectedLanguage$).getLastValue()).toBe('es');
    expect(localStorage.getItem(TRANSLATE_LOCALSTORAGE_KEY)).toBe('es');
    expect(subscribeSpyTo(translate('testkey21342341')).getLastValue()).toBe('testkey21342341');
  });
});
