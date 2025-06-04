import { isPlatformBrowser } from '@angular/common';
import { FactoryProvider, InjectionToken, PLATFORM_ID, inject } from '@angular/core';

export const WINDOW = new InjectionToken<Window | undefined>('window');

const windowProvider: FactoryProvider = {
  provide: WINDOW,
  useFactory: () => {
    return isPlatformBrowser(inject(PLATFORM_ID)) ? window : undefined;
  },
};

export const provideWindow = (): FactoryProvider => windowProvider;

export function injectWindow() {
  return inject(WINDOW);
}
