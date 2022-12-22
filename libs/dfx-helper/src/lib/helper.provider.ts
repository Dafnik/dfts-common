import {ValueProvider} from '@angular/core';
import {HELPER_CONFIG, HelperConfig} from './config';
import {getLogHeader} from 'dfts';

export const provideDfxHelper = (configuration: HelperConfig = {}): ValueProvider => {
  console.log(getLogHeader('INFO', 'provideDfxHelper', 'setup', 'Configuration file'), configuration);
  return {provide: HELPER_CONFIG, useValue: configuration};
};
