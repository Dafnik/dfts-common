import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  { path: '', loadComponent: () => import('./home.component').then((c) => c.HomeComponent) },
  { path: 'base64-pdf-converter', loadComponent: () => import('./base64-to-pdf-converter.component').then((c) => c.Base64ToPdfConverterComponent) },
  { path: '**', redirectTo: '' },
];
