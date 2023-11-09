import { TestBed } from '@angular/core/testing';
import { provideDfxTranslate } from '../../translate.provider';
import { withRememberLanguage } from '../remember-language/remember-language';
import { TRANSLATE_LIBRE_TRANSLATE_INSTANCE_URL, withLibreTranslate } from './libre-translate';

describe('libre-translate feature', () => {
  beforeAll(() => localStorage.clear());

  it('should inject default value', () => {
    void TestBed.configureTestingModule({
      providers: [provideDfxTranslate(withRememberLanguage(false))],
    }).compileComponents();

    expect(TestBed.inject(TRANSLATE_LIBRE_TRANSLATE_INSTANCE_URL)).toBe(undefined);
  });

  it('should inject configured value', () => {
    void TestBed.configureTestingModule({
      providers: [provideDfxTranslate(withRememberLanguage(false), withLibreTranslate('https://anything'))],
    }).compileComponents();

    expect(TestBed.inject(TRANSLATE_LIBRE_TRANSLATE_INSTANCE_URL)).toBe('https://anything');
  });
});
