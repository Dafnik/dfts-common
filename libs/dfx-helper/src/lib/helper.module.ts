import { ModuleWithProviders, NgModule } from '@angular/core';

import { getLogMessage } from 'dfts-helper';

import { HelperFeatures } from './features';

@NgModule()
export class DfxHelperModule {
  static setup(...features: HelperFeatures[]): ModuleWithProviders<DfxHelperModule> {
    console.log(getLogMessage('INFO', 'provideDfxHelper', 'setup', 'Features'), features);
    return {
      ngModule: DfxHelperModule,
      providers: [features.map((it) => it.providers)],
    };
  }
}
