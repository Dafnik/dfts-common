import {ModuleWithProviders, NgModule} from '@angular/core';

import {HELPER_CONFIG, HelperConfig} from './config';
import {getLogHeader} from 'dfts';

@NgModule()
export class DfxHelperModule {
  static setup(configuration: HelperConfig = {}): ModuleWithProviders<DfxHelperModule> {
    console.log(getLogHeader('INFO', 'DfxHelperModule', 'setup', 'Configuration file'), configuration);
    return {
      ngModule: DfxHelperModule,
      providers: [
        {
          provide: HELPER_CONFIG,
          useValue: configuration,
        },
      ],
    };
  }
}
