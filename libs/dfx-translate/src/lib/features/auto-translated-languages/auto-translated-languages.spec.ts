import { TestBed } from '@angular/core/testing';
import { provideDfxTranslate } from '../../translate.provider';
import { withRememberLanguage } from '../remember-language/remember-language';
import { TRANSLATE_AUTO_TRANSLATED_LANGUAGES, withAutoTranslatedLanguages } from './auto-translated-languages';

describe('auto-translated-languages feature', () => {
  beforeAll(() => localStorage.clear());

  it('should inject default value', () => {
    void TestBed.configureTestingModule({
      providers: [provideDfxTranslate(withRememberLanguage(false))],
    }).compileComponents();

    expect(TestBed.inject(TRANSLATE_AUTO_TRANSLATED_LANGUAGES)).toStrictEqual([]);
    expect(TestBed.inject(TRANSLATE_AUTO_TRANSLATED_LANGUAGES).length).toBe(0);
  });

  it('should inject configured value', () => {
    void TestBed.configureTestingModule({
      providers: [provideDfxTranslate(withRememberLanguage(false), withAutoTranslatedLanguages(['de', 'es']))],
    }).compileComponents();

    expect(TestBed.inject(TRANSLATE_AUTO_TRANSLATED_LANGUAGES)).toStrictEqual(['de', 'es']);
    expect(TestBed.inject(TRANSLATE_AUTO_TRANSLATED_LANGUAGES).length).toBe(2);
  });

  it('should inject configured value 2', () => {
    void TestBed.configureTestingModule({
      providers: [provideDfxTranslate(withRememberLanguage(false), withAutoTranslatedLanguages(['de']))],
    }).compileComponents();

    expect(TestBed.inject(TRANSLATE_AUTO_TRANSLATED_LANGUAGES)).toStrictEqual(['de']);
    expect(TestBed.inject(TRANSLATE_AUTO_TRANSLATED_LANGUAGES).length).toBe(1);
  });

  it('should inject configured value 3', () => {
    void TestBed.configureTestingModule({
      providers: [provideDfxTranslate(withRememberLanguage(false), withAutoTranslatedLanguages([]))],
    }).compileComponents();

    expect(TestBed.inject(TRANSLATE_AUTO_TRANSLATED_LANGUAGES)).toStrictEqual([]);
    expect(TestBed.inject(TRANSLATE_AUTO_TRANSLATED_LANGUAGES).length).toBe(0);
  });
});
