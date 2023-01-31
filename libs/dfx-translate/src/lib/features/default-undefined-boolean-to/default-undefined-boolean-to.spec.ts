import {TestBed} from '@angular/core/testing';
import {provideDfxTranslate} from '../../translate.provider';
import {withRememberLanguage} from '../remember-language/remember-language';
import {TRANSLATE_DEFAULT_UNDEFINED_OR_NULL_BOOLEAN_TO, withDefaultUndefinedOrNullBooleanTo} from './default-undefined-boolean-to';

describe('default-undefined-boolean-to feature', () => {
  beforeAll(() => localStorage.clear());

  it('should inject default value', () => {
    void TestBed.configureTestingModule({
      providers: [provideDfxTranslate(withRememberLanguage(false))],
    }).compileComponents();

    expect(TestBed.inject(TRANSLATE_DEFAULT_UNDEFINED_OR_NULL_BOOLEAN_TO)).toBe(null);
  });

  it('should inject configured value', () => {
    void TestBed.configureTestingModule({
      providers: [provideDfxTranslate(withRememberLanguage(false), withDefaultUndefinedOrNullBooleanTo(null))],
    }).compileComponents();

    expect(TestBed.inject(TRANSLATE_DEFAULT_UNDEFINED_OR_NULL_BOOLEAN_TO)).toBe(null);
  });

  it('should inject configured value 2', () => {
    void TestBed.configureTestingModule({
      providers: [provideDfxTranslate(withRememberLanguage(false), withDefaultUndefinedOrNullBooleanTo(true))],
    }).compileComponents();

    expect(TestBed.inject(TRANSLATE_DEFAULT_UNDEFINED_OR_NULL_BOOLEAN_TO)).toBe(true);
  });

  it('should inject configured value 2', () => {
    void TestBed.configureTestingModule({
      providers: [provideDfxTranslate(withRememberLanguage(false), withDefaultUndefinedOrNullBooleanTo(false))],
    }).compileComponents();

    expect(TestBed.inject(TRANSLATE_DEFAULT_UNDEFINED_OR_NULL_BOOLEAN_TO)).toBe(false);
  });
});
