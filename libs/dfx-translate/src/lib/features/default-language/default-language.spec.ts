import {TestBed} from '@angular/core/testing';
import {provideDfxTranslate} from '../../translate.provider';
import {withRememberLanguage} from '../remember-language/remember-language';
import {TRANSLATE_DEFAULT_LANGUAGE, withDefaultLanguage} from './default-language';

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
});
