import {FactoryProvider, inject, InjectionToken, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';

export const WINDOW = new InjectionToken<Window | undefined>('window');

const windowProvider: FactoryProvider = {
  provide: WINDOW,
  useFactory: () => {
    return isPlatformBrowser(inject(PLATFORM_ID)) ? window : undefined;
  },
};

export const provideWindow = (): FactoryProvider => windowProvider;
