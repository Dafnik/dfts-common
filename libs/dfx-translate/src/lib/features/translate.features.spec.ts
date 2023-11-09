import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { serviceStub, TRANSLATE_SET_LANGUAGE_FN } from '../test-helper';
import { provideDfxTranslate } from '../translate.provider';
import { TranslateStore } from '../service/translate.store';
import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { dfxTranslateSetLanguage } from '../service/set-language';
import { dfxTranslateSetLanguageFn } from '../types';
import { TRANSLATE_DEFAULT_LANGUAGE, withDefaultLanguage } from './default-language/default-language';
import { withAssetsPath } from './assets-path/assets-path';
import { TRANSLATE_REMEMBER_LANGUAGE } from './remember-language/remember-language';
import { TRANSLATE_AUTO_TRANSLATED_LANGUAGES, withAutoTranslatedLanguages } from './auto-translated-languages/auto-translated-languages';

describe('TranslateConfig', () => {
  let translateStore: TranslateStore;
  let setLanguage: dfxTranslateSetLanguageFn;

  beforeEach(() => {
    localStorage.clear();

    void TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: serviceStub },
        provideDfxTranslate(),
        {
          provide: TRANSLATE_SET_LANGUAGE_FN,
          useFactory: () => dfxTranslateSetLanguage(),
        },
      ],
    }).compileComponents();

    translateStore = TestBed.inject(TranslateStore);
    setLanguage = TestBed.inject(TRANSLATE_SET_LANGUAGE_FN);
  });

  it('should use default values', () => {
    expect(TestBed.inject(TRANSLATE_DEFAULT_LANGUAGE)).toBe('en');
    expect(TestBed.inject(TRANSLATE_AUTO_TRANSLATED_LANGUAGES).length).toBe(0);
    expect(TestBed.inject(TRANSLATE_REMEMBER_LANGUAGE)).toBeTruthy();

    expect(subscribeSpyTo(translateStore.selectedLanguage$).getLastValue()).toBe('en');
  });

  it('should language be defined', () => {
    expect(subscribeSpyTo(translateStore.translations$).getLastValue()).not.toStrictEqual({});
  });

  it('should autotranslated language be undefined', () => {
    expect(subscribeSpyTo(translateStore.autoGeneratedTranslations$).getLastValue()).toStrictEqual({});
  });

  it('should not store default language', () => {
    expect(localStorage.getItem('language')).toBeNull();
    expect(subscribeSpyTo(translateStore.selectedLanguage$).getLastValue()).toBe('en');
  });

  it('should store changed language in local storage', () => {
    expect(subscribeSpyTo(translateStore.selectedLanguage$).getLastValue()).toBe('en');
    expect(localStorage.getItem('language')).toBeNull();
    setLanguage('de');
    expect(localStorage.getItem('language')).toBeDefined();
    expect(localStorage.getItem('language')).toBe('de');
    expect(subscribeSpyTo(translateStore.selectedLanguage$).getLastValue()).toBe('de');
  });

  it('should change language via spy', () => {
    const simpleFnSpy = jest.fn(setLanguage);
    simpleFnSpy('de');
    expect(simpleFnSpy).toHaveBeenCalledWith('de');
  });

  it('should change language', () => {
    setLanguage('de');
    expect(subscribeSpyTo(translateStore.selectedLanguage$).getLastValue()).toBe('de');
  });
});

describe('TranslateConfig2', () => {
  let translateStore: TranslateStore;
  let setLanguage: dfxTranslateSetLanguageFn;

  beforeEach(() => {
    localStorage.clear();

    void TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: serviceStub },
        provideDfxTranslate(withAssetsPath('assets/i18n/'), withAutoTranslatedLanguages(['de'])),
        {
          provide: TRANSLATE_SET_LANGUAGE_FN,
          useFactory: () => dfxTranslateSetLanguage(),
        },
      ],
    }).compileComponents();

    translateStore = TestBed.inject(TranslateStore);
    setLanguage = TestBed.inject(TRANSLATE_SET_LANGUAGE_FN);
  });

  it('should store changed language as cookie 2', () => {
    setLanguage('de');
    expect(localStorage.getItem('language')).toBe('de');
    expect(subscribeSpyTo(translateStore.selectedLanguage$).getLastValue()).toBe('de');
  });
});

describe('TranslateConfigChanged', () => {
  let translateStore: TranslateStore;
  let setLanguage: dfxTranslateSetLanguageFn;

  beforeEach(() => {
    localStorage.clear();

    void TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: serviceStub },
        provideDfxTranslate(withDefaultLanguage('de')),
        {
          provide: TRANSLATE_SET_LANGUAGE_FN,
          useFactory: () => dfxTranslateSetLanguage(),
        },
      ],
    }).compileComponents();

    translateStore = TestBed.inject(TranslateStore);
    setLanguage = TestBed.inject(TRANSLATE_SET_LANGUAGE_FN);
  });

  it('should use default values', () => {
    expect(TestBed.inject(TRANSLATE_DEFAULT_LANGUAGE)).toBe('de');
    expect(TestBed.inject(TRANSLATE_AUTO_TRANSLATED_LANGUAGES).length).toBe(0);
    expect(TestBed.inject(TRANSLATE_REMEMBER_LANGUAGE)).toBeTruthy();

    expect(subscribeSpyTo(translateStore.selectedLanguage$).getLastValue()).toBe('de');
  });

  it('should language be defined', () => {
    expect(subscribeSpyTo(translateStore.translations$).getLastValue()).not.toStrictEqual({});
  });

  it('should autotranslated language be undefined', () => {
    expect(subscribeSpyTo(translateStore.autoGeneratedTranslations$).getLastValue()).toStrictEqual({});
  });

  it('should not store default language', () => {
    expect(localStorage.getItem('language')).toBeNull();
    expect(subscribeSpyTo(translateStore.selectedLanguage$).getLastValue()).toBe('de');
  });

  it('should store changed language in local storage', () => {
    expect(subscribeSpyTo(translateStore.selectedLanguage$).getLastValue()).toBe('de');
    expect(localStorage.getItem('language')).toBeNull();
    setLanguage('en');
    expect(localStorage.getItem('language')).toBeDefined();
    expect(localStorage.getItem('language')).toBe('en');
    expect(subscribeSpyTo(translateStore.selectedLanguage$).getLastValue()).toBe('en');
  });

  it('should change language via spy', () => {
    const simpleFnSpy = jest.fn(setLanguage);
    simpleFnSpy('en');
    expect(simpleFnSpy).toHaveBeenCalledWith('en');
  });

  it('should change language', () => {
    setLanguage('en');
    expect(subscribeSpyTo(translateStore.selectedLanguage$).getLastValue()).toBe('en');
  });
});
