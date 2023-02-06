import {TestBed} from '@angular/core/testing';
import {provideDfxTranslate} from '../../translate.provider';
import {TRANSLATE_REMEMBER_LANGUAGE, withRememberLanguage} from './remember-language';

describe('remember-language feature', () => {
  beforeAll(() => localStorage.clear());

  it('should inject default value', () => {
    void TestBed.configureTestingModule({
      providers: [provideDfxTranslate()],
    }).compileComponents();

    expect(TestBed.inject(TRANSLATE_REMEMBER_LANGUAGE)).toBeTruthy();
  });

  it('should inject configured value', () => {
    void TestBed.configureTestingModule({
      providers: [provideDfxTranslate(withRememberLanguage(false))],
    }).compileComponents();

    expect(TestBed.inject(TRANSLATE_REMEMBER_LANGUAGE)).toBeFalsy();
  });
});
