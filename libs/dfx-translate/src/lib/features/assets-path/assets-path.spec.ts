import {TestBed} from '@angular/core/testing';
import {provideDfxTranslate} from '../../translate.provider';
import {TRANSLATE_ASSETS_PATH, withAssetsPath} from './assets-path';
import {withRememberLanguage} from '../remember-language/remember-language';

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
});
