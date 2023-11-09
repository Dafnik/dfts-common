import { InjectionToken } from '@angular/core';

export const HELPER_MOBILE_BREAKPOINT = new InjectionToken<number>('HELPER_MOBILE_BREAKPOINT', {
  factory: () => 992,
});

export const HELPER_BASE_URL = new InjectionToken<string>('HELPER_BASE_URL', {
  factory: () => '',
});

export const HELPER_BASE_URL_INTERCEPTOR_IGNORE_PATHS = new InjectionToken<string[]>('HELPER_BASE_URL_INTERCEPTOR_IGNORE_PATHS', {
  factory: () => [],
});

export const HELPER_LOGGING_INTERCEPTOR_IGNORE_PATHS = new InjectionToken<string[]>('HELPER_LOGGING_INTERCEPTOR_IGNORE_PATHS', {
  factory: () => [],
});

export const HELPER_POST_PUT_JSON_CONTENT_TYPE_INTERCEPTOR_IGNORE_PATHS = new InjectionToken<string[]>(
  'HELPER_POST_PUT_JSON_CONTENT_TYPE_INTERCEPTOR_IGNORE_PATHS',
  {
    factory: () => [],
  },
);
