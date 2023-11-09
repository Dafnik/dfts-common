import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { TranslateFeatures } from './features/translate.features';

export function provideDfxTranslate(...features: TranslateFeatures[]): EnvironmentProviders {
  return makeEnvironmentProviders([features.map((it) => it.providers)]);
}
