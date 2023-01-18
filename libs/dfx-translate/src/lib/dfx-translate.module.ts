import {APP_INITIALIZER, ModuleWithProviders, NgModule} from '@angular/core';

import {TranslateService} from './service/translate.service';
import {TranslateConfig} from './config/translate.config';
import {DfxTr} from './pipes/tr';
import {DfxTrB} from './pipes/trb';
import {DfxTrA} from './pipes/tra';
import {
  withAssetsPath,
  withAutoTranslatedLanguages,
  withDefaultLanguage,
  withDefaultUndefinedOrNullBooleanTo,
  withLibreTranslate,
  withRememberLanguage,
} from './translate.provider';
import {TranslateFeatures} from './types';

@NgModule({
  imports: [DfxTr, DfxTrB, DfxTrA],
  exports: [DfxTr, DfxTrB, DfxTrA],
})
export class DfxTranslateModule {
  /**
   * @deprecated
   * @param configuration
   */
  static setup(configuration: TranslateConfig = {}): ModuleWithProviders<DfxTranslateModule> {
    console.log('dfx-translate >> configuration', configuration);
    return {
      ngModule: DfxTranslateModule,
      providers: [
        withDefaultLanguage(configuration.defaultLanguage ?? 'en').providers,
        withDefaultUndefinedOrNullBooleanTo(configuration.defaultUndefinedOrNullBooleanTo ?? null).providers,
        withAssetsPath(configuration.assetsPath ?? 'assets/i18n/').providers,
        withRememberLanguage(configuration.useLocalStorage ?? true).providers,
        withAutoTranslatedLanguages(configuration.languagesWithAutoTranslation ?? []).providers,
        withLibreTranslate(configuration.libreTranslateInstanceUrl).providers,
        {
          provide: APP_INITIALIZER,
          useFactory: setupTranslateFactory,
          deps: [TranslateService],
          multi: true,
        },
      ],
    };
  }

  static setup2(...features: TranslateFeatures[]): ModuleWithProviders<DfxTranslateModule> {
    console.log('dfx-translate >> configuration', features);
    return {
      ngModule: DfxTranslateModule,
      providers: [
        features.map((it) => it.providers),
        {
          provide: APP_INITIALIZER,
          useFactory: setupTranslateFactory,
          deps: [TranslateService],
          multi: true,
        },
      ],
    };
  }
}

export function setupTranslateFactory(service: TranslateService): () => void {
  return () => service.use();
}
