import {APP_INITIALIZER, ModuleWithProviders, NgModule} from '@angular/core';

import {TranslateService} from './translate.service';
import {TRANSLATE_CONFIG, TranslateConfig} from './translate.config';
import {DfxTr} from './pipes/tr';
import {DfxTrB} from './pipes/trb';
import {DfxTrA} from './pipes/tra';

@NgModule({
  imports: [DfxTr, DfxTrB, DfxTrA],
  exports: [DfxTr, DfxTrB, DfxTrA],
})
export class DfxTranslateModule {
  static setup(configuration: TranslateConfig = {}): ModuleWithProviders<DfxTranslateModule> {
    console.log('dfx-translate >> configuration', configuration);
    return {
      ngModule: DfxTranslateModule,
      providers: [
        {
          provide: TRANSLATE_CONFIG,
          useValue: configuration,
        },
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
