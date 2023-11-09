import { InjectionToken } from '@angular/core';
import { TranslateFeature, TranslateFeatureKind } from '../translate.features';

export declare type DefaultUndefinedKeyToFeature = TranslateFeature<TranslateFeatureKind.DEFAULT_UNDEFINED_KEY_TO>;

export const TRANSLATE_DEFAULT_UNDEFINED_KEY_TO = new InjectionToken<string>('TRANSLATE_DEFAULT_UNDEFINED_KEY_TO', {
  factory: () => '',
});

export function withDefaultUndefinedKeyTo(defaultUndefinedOKeyTo: string): DefaultUndefinedKeyToFeature {
  return {
    kind: TranslateFeatureKind.DEFAULT_UNDEFINED_KEY_TO,
    providers: [{ provide: TRANSLATE_DEFAULT_UNDEFINED_KEY_TO, useValue: defaultUndefinedOKeyTo }],
  };
}
