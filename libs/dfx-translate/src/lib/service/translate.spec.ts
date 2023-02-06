import {HttpClient} from '@angular/common/http';
import {TestBed} from '@angular/core/testing';
import {serviceStub, TRANSLATE_FN, TRANSLATE_SET_LANGUAGE_FN} from '../test-helper';
import {provideDfxTranslate} from '../translate.provider';
import {subscribeSpyTo} from '@hirez_io/observer-spy';
import {TranslateStore} from './translate.store';
import {dfxTranslateSetLanguage} from './set-language';
import {dfxTranslateFn, dfxTranslateSetLanguageFn, TRANSLATE_LOCALSTORAGE_KEY} from '../types';
import {withAutoTranslatedLanguages} from '../features/auto-translated-languages/auto-translated-languages';
import {dfxTranslate} from './translate';

describe('dfxTranslate', () => {
  let translateStore: TranslateStore;
  let translate: dfxTranslateFn;
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
          provide: TRANSLATE_FN,
          useFactory: () => dfxTranslate(),
        },
        {
          provide: TRANSLATE_SET_LANGUAGE_FN,
          useFactory: () => dfxTranslateSetLanguage(),
        },
      ],
    }).compileComponents();

    translateStore = TestBed.inject(TranslateStore);

    translate = TestBed.inject(TRANSLATE_FN);
    setLanguage = TestBed.inject(TRANSLATE_SET_LANGUAGE_FN);
  });

  it('should translate null & undefined', async () => {
    expect(await translate(null)).toBe('');
    expect(await translate(undefined)).toBe('');
  });

  it('should translate not existing', async () => {
    expect(await translate('keyasdfasdf')).toBe('keyasdfasdf');
  });

  it('should translate', async () => {
    expect(await translate('testkey1')).toBe('testanswer1');
    expect(await translate('testkey2')).toBe('testanswer2');
  });

  it('should translate not auto', async () => {
    expect(await translate('testkey3')).toBe('testanswer3');
    expect(await translate('testkey4')).toBe('testanswer4');
  });

  it('should translate auto', async () => {
    setLanguage('de');
    expect(await translate('testkey3')).toBe('testanswer3_DE_auto');
    expect(await translate('testkey4')).toBe('testanswer4_DE_auto');
  });

  it('should translate changed language', async () => {
    setLanguage('de');
    expect(await translate('testkey1')).toBe('testanswer1_DE');
    expect(await translate('testkey2')).toBe('testanswer2_DE');
  });

  it('set error language', async () => {
    setLanguage('es');
    expect(subscribeSpyTo(translateStore.selectedLanguage$).getLastValue()).toBe('es');
    expect(localStorage.getItem(TRANSLATE_LOCALSTORAGE_KEY)).toBe('es');
    expect(await translate('testkey21342341')).toBe('testkey21342341');
  });
});
