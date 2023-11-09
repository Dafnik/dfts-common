import { TranslateFeature, TranslateFeatureKind } from '../translate.features';
import { InjectionToken } from '@angular/core';

export declare type AssetsPathFeature = TranslateFeature<TranslateFeatureKind.ASSETS_PATH>;

export const TRANSLATE_ASSETS_PATH = new InjectionToken<string>('TRANSLATE_ASSETS_PATH', {
  factory: () => 'assets/i18n/',
});

export function withAssetsPath(assetsPath: string): AssetsPathFeature {
  return {
    kind: TranslateFeatureKind.ASSETS_PATH,
    providers: [{ provide: TRANSLATE_ASSETS_PATH, useValue: assetsPath }],
  };
}
