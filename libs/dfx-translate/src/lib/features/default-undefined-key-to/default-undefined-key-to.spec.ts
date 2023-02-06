import {TestBed} from '@angular/core/testing';
import {provideDfxTranslate} from '../../translate.provider';
import {withRememberLanguage} from '../remember-language/remember-language';
import {TRANSLATE_DEFAULT_UNDEFINED_KEY_TO, withDefaultUndefinedKeyTo} from './default-undefined-key-to';

describe('default-undefined-key-to feature', () => {
  beforeAll(() => localStorage.clear());

  it('should inject default value', () => {
    void TestBed.configureTestingModule({
      providers: [provideDfxTranslate(withRememberLanguage(false))],
    }).compileComponents();

    expect(TestBed.inject(TRANSLATE_DEFAULT_UNDEFINED_KEY_TO)).toBe('');
  });

  it('should inject configured value', () => {
    void TestBed.configureTestingModule({
      providers: [provideDfxTranslate(withRememberLanguage(false), withDefaultUndefinedKeyTo('undefined'))],
    }).compileComponents();

    expect(TestBed.inject(TRANSLATE_DEFAULT_UNDEFINED_KEY_TO)).toBe('undefined');
  });
});
