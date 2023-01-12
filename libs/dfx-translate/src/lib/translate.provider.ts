import {ENVIRONMENT_INITIALIZER, inject, ValueProvider} from '@angular/core';
import {TRANSLATE_CONFIG, TranslateConfig} from './translate.config';
import {TranslateService} from './translate.service';

export function provideDfxTranslate(configuration: TranslateConfig = {}): ValueProvider[] {
  console.log('dfx-translate >> configuration', configuration);
  return [
    {provide: TRANSLATE_CONFIG, useValue: configuration},
    {
      provide: ENVIRONMENT_INITIALIZER,
      useValue: () => void inject(TranslateService).use(),
      multi: true,
    },
  ];
}
