import { ApplicationConfig, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { biCacheInterceptor, provideBi, withCDN } from 'dfx-bootstrap-icons';
import { provideClientHydration, withEventReplay, withIncrementalHydration } from '@angular/platform-browser';
import { provideDfxHelper, withWindow } from 'dfx-helper';

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideClientHydration(withEventReplay(), withIncrementalHydration()),
    provideHttpClient(withFetch(), withInterceptors([biCacheInterceptor])),
    provideDfxHelper(withWindow()),
    provideBi(withCDN('https://playground.dafnik.me/bootstrap-icons/icons')),
  ],
};
