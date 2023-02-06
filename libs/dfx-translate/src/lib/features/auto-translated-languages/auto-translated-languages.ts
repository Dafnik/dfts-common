import {InjectionToken} from '@angular/core';
import {TranslateFeature, TranslateFeatureKind} from '../translate.features';

export declare type AutoTranslatedLanguagesFeature = TranslateFeature<TranslateFeatureKind.AUTO_TRANSLATED_LANGUAGES>;

export const TRANSLATE_AUTO_TRANSLATED_LANGUAGES = new InjectionToken<string[]>('TRANSLATE_AUTO_TRANSLATED_LANGUAGES', {
  factory: () => [],
});

export function withAutoTranslatedLanguages(autoTranslatedLanguages: string[]): AutoTranslatedLanguagesFeature {
  return {
    kind: TranslateFeatureKind.AUTO_TRANSLATED_LANGUAGES,
    providers: [{provide: TRANSLATE_AUTO_TRANSLATED_LANGUAGES, useValue: autoTranslatedLanguages}],
  };
}
