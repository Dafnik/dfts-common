import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import {
  HELPER_BASE_URL,
  HELPER_BASE_URL_INTERCEPTOR_IGNORE_PATHS,
  HELPER_LOGGING_INTERCEPTOR_IGNORE_PATHS,
  HELPER_MOBILE_BREAKPOINT,
  HELPER_POST_PUT_JSON_CONTENT_TYPE_INTERCEPTOR_IGNORE_PATHS,
} from './config';
import { getLogMessage } from 'dfts-helper';
import {
  BaseUrlInterceptorFeature,
  HelperFeatureKind,
  HelperFeatures,
  LoggingInterceptorFeature,
  MobileBreakpointFeature,
  PostPutJsonContentTypeInterceptorFeature,
  WindowFeature,
} from './features';
import { provideIsMobileService } from './services/is-mobile';
import { provideWindow } from './windows-provider';

export function provideDfxHelper(...features: HelperFeatures[]): EnvironmentProviders {
  console.log(getLogMessage('INFO', 'provideDfxHelper', 'setup', 'Features'), features);
  return makeEnvironmentProviders([features.map((it) => it.providers)]);
}

export function withMobileBreakpoint(mobileBreakpoint: number): MobileBreakpointFeature {
  return {
    kind: HelperFeatureKind.MOBILE_BREAKPOINT,
    providers: [{ provide: HELPER_MOBILE_BREAKPOINT, useValue: mobileBreakpoint }, provideIsMobileService()],
  };
}

export function withBaseUrlInterceptor(baseUrl: string, paths: string[] = []): BaseUrlInterceptorFeature {
  return {
    kind: HelperFeatureKind.BASE_URL_INTERCEPTOR,
    providers: [
      { provide: HELPER_BASE_URL, useValue: baseUrl },
      { provide: HELPER_BASE_URL_INTERCEPTOR_IGNORE_PATHS, useValue: paths },
    ],
  };
}

export function withLoggingInterceptor(paths: string[] = []): LoggingInterceptorFeature {
  return {
    kind: HelperFeatureKind.LOGGING_INTERCEPTOR_IGNORE_PATHS,
    providers: [{ provide: HELPER_LOGGING_INTERCEPTOR_IGNORE_PATHS, useValue: paths }],
  };
}

export function withPostPutJsonContentTypeInterceptor(paths: string[] = []): PostPutJsonContentTypeInterceptorFeature {
  return {
    kind: HelperFeatureKind.POST_PUT_JSON_CONTENT_TYPE_INTERCEPTOR_IGNORE_PATHS,
    providers: [{ provide: HELPER_POST_PUT_JSON_CONTENT_TYPE_INTERCEPTOR_IGNORE_PATHS, useValue: paths }],
  };
}
export function withWindow(): WindowFeature {
  return {
    kind: HelperFeatureKind.WINDOW,
    providers: [provideWindow()],
  };
}
