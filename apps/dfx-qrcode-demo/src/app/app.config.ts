import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideClientHydration, withEventReplay, withIncrementalHydration } from '@angular/platform-browser';

import { biCacheInterceptor, provideBi, withCDN } from 'dfx-bootstrap-icons';
import { provideDfxHelper, withWindow } from 'dfx-helper';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideClientHydration(withEventReplay(), withIncrementalHydration()),
    provideHttpClient(withFetch(), withInterceptors([biCacheInterceptor])),
    provideDfxHelper(withWindow()),
    provideBi(withCDN('https://playground.dafnik.me/bootstrap-icons/icons')),
  ],
};
