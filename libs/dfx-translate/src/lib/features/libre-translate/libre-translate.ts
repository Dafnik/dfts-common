import { InjectionToken } from '@angular/core';
import { TranslateFeature, TranslateFeatureKind } from '../translate.features';

export declare type LibreTranslateFeature = TranslateFeature<TranslateFeatureKind.LIBRE_TRANSLATE>;

export const TRANSLATE_LIBRE_TRANSLATE_INSTANCE_URL = new InjectionToken<string | undefined>('TRANSLATE_LIBRE_TRANSLATE_INSTANCE_URL', {
  factory: () => undefined,
});

export function withLibreTranslate(libreTranslateInstanceUrl?: string): LibreTranslateFeature {
  return {
    kind: TranslateFeatureKind.LIBRE_TRANSLATE,
    providers: [{ provide: TRANSLATE_LIBRE_TRANSLATE_INSTANCE_URL, useValue: libreTranslateInstanceUrl }],
  };
}
