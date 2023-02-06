import {InjectionToken} from '@angular/core';
import {TranslateFeature, TranslateFeatureKind} from '../translate.features';

export declare type RememberLanguageFeature = TranslateFeature<TranslateFeatureKind.REMEMBER_LANGUAGE>;

export const TRANSLATE_REMEMBER_LANGUAGE = new InjectionToken<boolean>('TRANSLATE_REMEMBER_LANGUAGE', {
  factory: () => true,
});

export function withRememberLanguage(rememberLanguage: boolean): RememberLanguageFeature {
  return {
    kind: TranslateFeatureKind.REMEMBER_LANGUAGE,
    providers: [{provide: TRANSLATE_REMEMBER_LANGUAGE, useValue: rememberLanguage}],
  };
}
