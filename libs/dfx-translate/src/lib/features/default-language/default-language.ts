import { TranslateFeature, TranslateFeatureKind } from '../translate.features';
import { InjectionToken } from '@angular/core';

export declare type DefaultLanguageFeature = TranslateFeature<TranslateFeatureKind.DEFAULT_LANGUAGE>;

export const TRANSLATE_DEFAULT_LANGUAGE = new InjectionToken<string>('TRANSLATE_DEFAULT_LANGUAGE', {
  factory: () => 'en',
});

export function withDefaultLanguage(language: string): DefaultLanguageFeature {
  return {
    kind: TranslateFeatureKind.DEFAULT_LANGUAGE,
    providers: [{ provide: TRANSLATE_DEFAULT_LANGUAGE, useValue: language }],
  };
}
