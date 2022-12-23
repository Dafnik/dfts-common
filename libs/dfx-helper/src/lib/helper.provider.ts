import {ValueProvider} from '@angular/core';
import {HELPER_CONFIG, HelperConfig} from './config';
import {getLogMessage} from 'dfts';

export const provideDfxHelper = (configuration: HelperConfig = {}): ValueProvider => {
  console.log(getLogMessage('INFO', 'provideDfxHelper', 'setup', 'Configuration file'), configuration);
  return {provide: HELPER_CONFIG, useValue: configuration};
};
