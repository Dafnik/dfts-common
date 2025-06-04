import { ApplicationConfig, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';
import { appRoutes } from './app.routes';
import { biCacheInterceptor, provideBi, withCDN, withSize } from 'dfx-bootstrap-icons';
import { provideDfxHelper, withWindow } from 'dfx-helper';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideClientHydration, withEventReplay, withIncrementalHydration } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideClientHydration(withEventReplay(), withIncrementalHydration()),
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
    provideHttpClient(withFetch(), withInterceptors([biCacheInterceptor])),
    provideBi(withCDN('https://playground.dafnik.me/bootstrap-icons/icons'), withSize('32')),
    provideDfxHelper(withWindow()),
  ],
};
