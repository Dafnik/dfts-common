import { ApplicationConfig, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';
import { appRoutes } from './app.routes';
import { allIcons, provideBi, withIcons, withSize } from 'dfx-bootstrap-icons';
import { provideDfxHelper, withWindow } from 'dfx-helper';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
    provideDfxHelper(withWindow()),
    provideHttpClient(),
    provideBi(withIcons(allIcons), withSize('32')),
  ],
};
