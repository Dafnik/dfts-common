import { ApplicationConfig } from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';
import { appRoutes } from './app.routes';
import { allIcons, provideBi, withHeight, withIcons, withWidth } from 'dfx-bootstrap-icons';
import { provideDfxHelper, withWindow } from 'dfx-helper';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
    provideDfxHelper(withWindow()),
    provideHttpClient(),
    provideBi(withIcons(allIcons), withWidth('32'), withHeight('48')),
  ],
};
