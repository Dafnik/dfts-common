import {ModuleWithProviders, NgModule} from '@angular/core';

import {HELPER_CONFIG, HelperConfig} from './config';
import {getLogMessage} from 'dfts-helper';

@NgModule()
export class DfxHelperModule {
  static setup(configuration: HelperConfig = {}): ModuleWithProviders<DfxHelperModule> {
    console.log(getLogMessage('INFO', 'DfxHelperModule', 'setup', 'Configuration file'), configuration);
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
