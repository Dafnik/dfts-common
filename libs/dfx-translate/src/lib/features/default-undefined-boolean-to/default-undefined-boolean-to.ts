import { InjectionToken } from '@angular/core';
import { TranslateFeature, TranslateFeatureKind } from '../translate.features';

export declare type DefaultUndefinedOrNullBooleanToFeature = TranslateFeature<TranslateFeatureKind.DEFAULT_UNDEFINED_OR_NULL_BOOLEAN_TO>;

export const TRANSLATE_DEFAULT_UNDEFINED_OR_NULL_BOOLEAN_TO = new InjectionToken<boolean | null>(
  'TRANSLATE_DEFAULT_UNDEFINED_OR_NULL_BOOLEAN_TO',
  {
    factory: () => null,
  },
);

export function withDefaultUndefinedOrNullBooleanTo(
  defaultUndefinedOrNullBooleanTo: boolean | null,
): DefaultUndefinedOrNullBooleanToFeature {
  return {
    kind: TranslateFeatureKind.DEFAULT_UNDEFINED_OR_NULL_BOOLEAN_TO,
    providers: [{ provide: TRANSLATE_DEFAULT_UNDEFINED_OR_NULL_BOOLEAN_TO, useValue: defaultUndefinedOrNullBooleanTo }],
  };
}
