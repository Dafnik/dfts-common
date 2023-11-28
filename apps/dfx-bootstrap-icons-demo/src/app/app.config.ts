import { ApplicationConfig } from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';
import { appRoutes } from './app.routes';
import {
  allIcons,
  biCacheInterceptor,
  provideBi,
  withHeight,
  withIcons,
  withWidth
} from "dfx-bootstrap-icons";
import { provideDfxHelper, withWindow } from 'dfx-helper';
import { provideHttpClient, withInterceptors } from "@angular/common/http";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
    provideDfxHelper(withWindow()),
    provideHttpClient(withInterceptors([biCacheInterceptor])),
    provideBi(withIcons(allIcons), withWidth('32'), withHeight('48')),
  ],
};
