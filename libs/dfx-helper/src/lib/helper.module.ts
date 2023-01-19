import {ModuleWithProviders, NgModule} from '@angular/core';

import {HelperConfig} from './config';
import {getLogMessage} from 'dfts-helper';
import {
  withBaseUrlInterceptor,
  withLoggingInterceptor,
  withMobileBreakpoint,
  withPostPutJsonContentTypeInterceptor,
} from './helper.provider';
import {HelperFeatures} from './features';

@NgModule()
export class DfxHelperModule {
  static setup(configuration: HelperConfig = {}): ModuleWithProviders<DfxHelperModule> {
    console.log(getLogMessage('INFO', 'DfxHelperModule', 'setup', 'Configuration file'), configuration);
    return {
      ngModule: DfxHelperModule,
      providers: [
        withMobileBreakpoint(configuration.isMobileBreakpoint ?? 992).providers,
        withBaseUrlInterceptor(configuration.baseUrl ?? '', configuration.baseUrlInterceptorIgnorePaths).providers,
        withLoggingInterceptor(configuration.loggingInterceptorIgnorePaths).providers,
        withPostPutJsonContentTypeInterceptor(configuration.postPutJsonContentTypeInterceptorIgnorePaths).providers,
      ],
    };
  }

  static setup2(...features: HelperFeatures[]): ModuleWithProviders<DfxHelperModule> {
    console.log(getLogMessage('INFO', 'provideDfxHelper', 'setup', 'Features'), features);
    return {
      ngModule: DfxHelperModule,
      providers: [features.map((it) => it.providers)],
    };
  }
}
